import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Platform, TouchableOpacity, FlatList,
} from 'react-native';
import {Icon, Avatar, Overlay, ListItem, Text} from "react-native-elements";

import {withNavigation} from "react-navigation";
import colors from "../../../constants/Colors";
import request from "../../../utils/customRequest";

class PresetItemScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Preset',
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
        onPress={() => navigation.navigate('Preset')}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      itemData: {}
      , exercises: {}
      , dictRef: {}
      , isLoading: true
      , isOverlayVisible: false
    };
  }

  getExerciseData = async (itemData) => {
    const {_id} = itemData;
    const url = global.apiUrl + '/preset/' + _id;
    try {
      const body = await request(url, 'GET');
      if (body.error) return;
      const {exercises} = body;
      this.setState({exercises});
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const itemData = this.props.navigation.getParam('itemData');
      await this.getExerciseData(itemData);
      const dictRef = await AsyncStorage.getItem('@exercises_dictionary');
      this.setState({dictRef: JSON.parse(dictRef)});
      this.setState({itemData});
      this.setState({isLoading: false});
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidUpdate() {
    try {
      console.log("componentDidUpdate invoked");
    } catch (err) {
      console.log(err);
    }
  }

  keyExtractor = (item) => item._id.toString();
  overlayKeyExtractor = ([id, object]) => id.toString();

  renderAvatar = (exercise) => {
    const {name, icon} = exercise;
    if (icon) {
      return (
        <Avatar
          rounded
          size='medium'
          source={{uri: icon}}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          size='medium'
          title={`${name.substring(0, 3).toUpperCase()}`}
          titleStyle={{fontSize: 14}}
        />
      );
    }
  };

  renderOverlayItem = ({item}) => {
    const [id, exerciseDescription] = item;

    console.log(id, exerciseDescription);
    return (
      <ListItem
        Component={TouchableOpacity}
        onPress={() => this.setState({isOverlayVisible: false})}
        key={id}
        leftAvatar={this.renderAvatar(exerciseDescription)}
        title={exerciseDescription.name}
        subtitle={exerciseDescription.description}
      />
    );
  };

  renderOverlay = () => {
    return (
      <Overlay
        isVisible={this.state.isOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        onBackdropPress={() => {
          this.setState({isOverlayVisible: false});
          this.state.array.push(id);
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
        onPress={() => this.setState({isOverlayVisible: true})}
        title="Add new exercise"
        leftIcon={{
          name: 'add',
          color: colors.BLACK,
          size: 30,
          backgroundColor: colors.BLACK
        }}
      />
    );
  };

  renderItem = ({item}) => (
    <ListItem
      key={item._id}
      title={this.state.dictRef[item.exerciseDictionaryId].name}
      subtitle={this.state.dictRef[item.exerciseDictionaryId].description}
      bottomDivider/>
  );

  render() {
    if (this.state.isLoading)
      return (<View/>);
    return (
      <View>
        {this.renderOverlay()}
        <FlatList style={styles.list}
                  data={this.state.exercises}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ListFooterComponent={this.renderFooter}
        /></View>);
  }
}

const styles = StyleSheet.create({
  item: {
    borderColor: colors.BLACK,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
  },
  itemTitle: {
    fontSize: 32,
    paddingLeft: 40,
  },
  list: {
    marginTop: 30,
  },
  icon: {
    paddingLeft: 10,
  },
});

export default withNavigation(PresetItemScreen);
