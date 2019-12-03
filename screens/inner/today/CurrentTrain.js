import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Avatar, ListItem, Button} from "react-native-elements";
import colors from "../../../constants/Colors";


const getUpdatedSelectedItemsArray = (selectedItems, id) => {
  const marked = [id];
  if (selectedItems.includes(id)) {
    return selectedItems.filter(item => !marked.includes(item));
  }
  selectedItems.push(id);
  return selectedItems;
};

class CurrentTrain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      trainData: {},
      nextSelected: 0,
      exercises: []
    };
  }

  async componentDidMount() {
    try {
      const trainData = this.props.navigation.getParam('trainData');
      this.setState({
        trainData: trainData,
        isLoading: false
      });
    } catch (err) {
      console.log(err);
    }
  }

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

  keyExtractor = (item) => item._id.toString();
  fakeExtractor = (num) => num.key.toString();

  populateRepetition(exerciseData) {
    let repeatData = [];
    const innerData = exerciseData.excerciseDictionaryData;
    const init = exerciseData.weight;
    const step = innerData.weightStep;
    const repCount = exerciseData.repetitionCount;
    let counter = init;
    repeatData.push({key: init, isChecked: false});
    for (let i = 1; i < repCount; ++i) {
      counter += step;
      repeatData.push({key: counter, isChecked: false});
    }
    return repeatData;
  }

  repetitionOnPressHandler = (data) => {
    let idx = this.state.nextSelected;
    data[++idx].isChecked = true;
    console.log(idx);
    this.setState({nextSelected: idx});
  };


  renderRepetitionEntity = ({item}) => {
    return (<ListItem
      Component={TouchableOpacity}
      color={() => item.isChecked ? colors.LIGHT_BLUE : colors.TORCH_RED}
      title={item.key.toString()}
    />)
  };

  printOrderedList = (item) => {
    const innerData = item.excerciseDictionaryData;
    let repeatData = this.populateRepetition(item);
    return (
      <View>
        <TouchableOpacity
          style={styles.item}>
          <Avatar
            rounded
            size='medium'
            title={`${innerData.name.substring(0, 3).toUpperCase()}`}
            titleStyle={{fontSize: 14}}
          />
          <FlatList
            horizontal={true}
            data={repeatData}
            renderItem={this.renderRepetitionEntity}
            keyExtractor={this.fakeExtractor}
          />
        </TouchableOpacity>
      </View>)
  };

  renderListItem = ({item}) => {
    return this.printOrderedList(item);
  };

  renderFooter = () => {
    return (<Button
      title='Cancel'
      onPress={() => this.props.navigation.navigate('Home', {canceled: true})}
    />)
  };

  renderScreen = (trainData) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={trainData.preset.exercises}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={this.renderFooter}
        />
      </View>);
  };

  render() {
    if (this.state.isLoading)
      return (<View/>);
    return this.renderScreen(this.state.trainData);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  item: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
  },
});

export default withNavigation(CurrentTrain);
