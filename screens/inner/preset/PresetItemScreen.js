import React from 'react';
import {
  AsyncStorage,
  FlatList,
  Picker,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Icon, ListItem, Overlay } from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import colors from '../../../constants/Colors';
import methods from '../../../constants/Methods';
import request from '../../../utils/customRequest';

class PresetItemScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: `Edit: ${navigation.state.params.itemData.name}`,
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
        onPress={() => navigation.navigate('Preset')}
      />
    ),
    headerRight: (
      <View style={styles.iconContainer}>
        <Icon
          type="ionicon"
          name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
          onPress={async () => {
            const { params = {} } = navigation.state;
            const { itemData = {}, exercises } = params;
            if (exercises) {
              console.log(exercises);
              const exercisesUrl = `${global.apiUrl}/exercise/`;
              const promises = exercises.map((exercise) => {
                return request(exercisesUrl + exercise._id, methods.PUT, { ...exercise });
              });
              await Promise.all(promises);
            }
            const url = `${global.apiUrl}/preset/${itemData._id}`;
            try {
              await request(url, methods.PUT, itemData);
            } catch (err) {
              console.log(err);
            }
            await navigation.state.params.goBack(itemData);
            navigation.goBack();
            navigation.navigate('Preset', { updated: true, itemData });
          }}/>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      itemData: {},
      exercises: {},
      dictRef: {},
      language: 0,
      isLoading: true,
      isOverlayVisible: false,
    };
  }

  getExerciseData = async (itemData) => {
    const url = `${global.apiUrl}/preset/${itemData._id}`;
    try {
      const body = await request(url, 'GET');
      if (body.error) {
        return;
      }
      this.setState({ exercises } = body);
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const itemData = this.props.navigation.getParam('itemData');
      console.log(itemData);
      await this.getExerciseData(itemData);
      const dictRef = await AsyncStorage.getItem('@exercises_dictionary');
      this.setState({
        dictRef: JSON.parse(dictRef),
        isLoading: false,
        itemData,
      });
    } catch (err) {
      console.log(err);
    }
  }

  formExerciseObject = async (exerciseDictionaryId) => {
    const url = `${global.apiUrl}/exercise`;
    try {
      const exercises = this.state.exercises;
      const body = { exerciseDictionaryId, userId: global.userId, weight: 0, repetitionCount: 0 };
      const exerciseObject = await request(url, methods.POST, body);

      const itemData = this.state.itemData;
      itemData.exercises.push(exerciseObject._id);

      this.props.navigation.setParams({ itemData });

      exercises.push(exerciseObject);
      return exercises;
    } catch (error) {
      console.log(error);
    }
  };

  keyExtractor = (item) => item._id.toString();
  overlayKeyExtractor = ([id, object]) => id.toString();

  renderAvatar = (exercise) => {
    const { name, icon } = exercise;
    if (icon) {
      return (
        <Avatar
          rounded
          size='small'
          source={{ uri: icon }}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          size='small'
          title={`${name.substring(0, 3).toUpperCase()}`}
          titleStyle={{ fontSize: 14 }}
        />
      );
    }
  };

  renderOverlayItem = ({ item }) => {
    const [id, exerciseDescription] = item;
    return (
      <ListItem
        Component={TouchableOpacity}
        onPress={async () => {
          const exercises = await this.formExerciseObject(id);
          this.setState({ isOverlayVisible: false, exercises });
          this.props.navigation.setParams({ exercises });
        }}
        key={id}
        leftAvatar={this.renderAvatar(exerciseDescription)}
        title={exerciseDescription.name}
        subtitle={exerciseDescription.description}
      />
    );
  };

  renderOverlay = () => {
    // TODO Overlay recolors the StatusBar
    return (
      <Overlay
        isVisible={this.state.isOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        onBackdropPress={() => {
          this.setState({ isOverlayVisible: false });
        }}
      >
        <FlatList
          data={Object.entries(this.state.dictRef)}
          renderItem={this.renderOverlayItem}
          keyExtractor={this.overlayKeyExtractor}
        />
      </Overlay>
    );
  };

  renderFooter = () => {
    return (
      <ListItem
        Component={TouchableOpacity}
        onPress={() => this.setState({ isOverlayVisible: true })}
        title="Add new exercise"
        leftIcon={{
          name: 'add',
          color: colors.BLACK,
          size: 30,
          backgroundColor: colors.BLACK,
        }}
      />
    );
  };

  renderItemView = ({ item }) => {
    const dictionaryItem = this.state.dictRef[item.exerciseDictionaryId];
    const {
      name,
      description,
      maximumWeight,
      weightStep,
    } = dictionaryItem;

    const exercises = this.state.exercises;
    const itemId = exercises.findIndex((arrItem) => item._id === arrItem._id);
    return (
      <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={[styles.subView]}>
          {this.renderAvatar(dictionaryItem)}
        </View>
        <View style={styles.subView}>
          <View>
            <Text>{name}</Text>
          </View>
        </View>
        <View style={styles.subView}>
          {this.renderWeightPicker(maximumWeight, weightStep, itemId)}
        </View>
        <View style={styles.subView}>
          {this.renderRepetitionPicker(itemId)}
        </View>
        <View style={[styles.subView]}>
          <Icon
            containerStyle={styles.icon}
            type="ionicon"
            name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
            onPress={() => {
              const nonF = this.state.exercises;

              const exercises = nonF.filter(({ _id }) => _id !== item._id);

              const itemData = this.state.itemData;
              itemData.exercises = exercises.map(({ _id }) => _id);

              this.props.navigation.setParams({ itemData, exercises });
              this.setState({ exercises });
            }}
          />
        </View>
      </View>
    );
  };

  fillArray = (max, step, min = 0) => {
    const arr = [];
    for (let i = min; i <= max; i += step) {
      arr.push({ label: i, value: i });
    }
    return arr;
  };

  renderWeightPicker = (max, step, id) => {
    const values = this.fillArray(max, step);
    return (
      <Picker
        selectedValue={this.state.exercises[id].weight}
        style={{ height: 50, width: 95 }}
        onValueChange={(itemValue, itemIndex) => {
          const exercises = this.state.exercises;
          exercises[id].weight = itemValue;
          this.setState({ exercises });
          this.props.navigation.setParams({ exercises });
        }
        }>
        {
          values.map(item => {
            return (<Picker.Item label={`${item.label}`} value={item.value} key={item.value}/>);
          })
        }
      </Picker>
    );
  };

  renderRepetitionPicker = (id) => {
    const values = this.fillArray(10, 1, 1);
    return (
      <Picker
        selectedValue={this.state.exercises[id].repetitionCount}
        style={{ height: 50, width: 75 }}
        onValueChange={(itemValue, itemIndex) => {
          const exercises = this.state.exercises;
          exercises[id].repetitionCount = itemValue;

          this.props.navigation.setParams({ exercises });
          this.setState({ exercises });
        }
        }>
        {
          values.map(item => {
            return (<Picker.Item label={`${item.label}`} value={item.value} key={item.value}/>);
          })
        }
      </Picker>
    );
  };

  renderItem = ({ item }) => {
    const dictionaryItem = this.state.dictRef[item.exerciseDictionaryId];
    const {
      name,
      description,
      maximumWeight,
      weightStep,
    } = dictionaryItem;

    return (
      <View>
        <ListItem
          Component={View}
          key={item._id}
          title={name}
          subtitle={description}
          leftAvatar={this.renderAvatar(dictionaryItem)}
          bottomDivider>

        </ListItem>
      </View>
    );
  };

  render() {
    if (this.state.isLoading)
      return (<View/>);
    return (
      <View>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />

        {this.renderOverlay()}
        <FlatList style={styles.list}
                  data={this.state.exercises}
                  extraData={this.state}
                  renderItem={this.renderItemView}
                  keyExtractor={this.keyExtractor}
                  ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    marginTop: 30,
  },
  icon: {
    paddingLeft: 10,
  },
  subView: {
    alignSelf: 'center',
  },
});

export default withNavigation(PresetItemScreen);
