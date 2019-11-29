import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Text,
  Picker,
} from 'react-native';
import { Icon, Avatar, Overlay, ListItem } from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import colors from '../../../constants/Colors';
import methods from '../../../constants/Methods';
import request from '../../../utils/customRequest';

class PresetItemScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Preset',
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
        onPress={() => navigation.navigate('Preset')}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      itemData: {},
      exercises: {},
      dictRef: {},
      language: 'java',
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

  async componentDidUpdate() {
    try {
      console.log('componentDidUpdate invoked');
      console.log(this.state.exercises);
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

      exercises.push(exerciseObject);
      this.setState({ exercises });
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
          size='medium'
          source={{ uri: icon }}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          size='medium'
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
          await this.formExerciseObject(id);
          this.setState({ isOverlayVisible: false, exercises });
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

  renderPicker = () => {

    const picker = [{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];
    return (
      <Picker
        selectedValue={this.state.language}
        style={{ height: 10, width: 10 }}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({ language: itemValue })
        }>
        {
          picker.map(item => {
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
    const picker = [{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];
    if (this.state.isLoading)
      return (<View/>);
    return (
      <View>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />

        <Picker
          selectedValue={this.state.language}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ language: itemValue })
          }>
          {
            picker.map(item => {
              return (<Picker.Item label={`${item.label}`} value={item.value} key={item.value}/>);
            })
          }
        </Picker>


        {this.renderOverlay()}
        <FlatList style={styles.list}
                  data={this.state.exercises}
                  extraData={this.state}
                  renderItem={this.renderItem}
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
});

export default withNavigation(PresetItemScreen);
