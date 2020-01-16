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
  const forDeletion = [id];
  if (selectedItems.includes(id)) {
    return selectedItems.filter(item => !forDeletion.includes(item));
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
      selectedItems: [],
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

  keyExtractor = (item) => item.id.toString();
  selectedKeyExtractor = (num) => num.id;

  populateRepetition(exerciseData) {
    let repeatData = [];
    const definitionData = exerciseData.definition;
    const fullData = exerciseData.exerciseFullData;
    const uniqId = definitionData.name;

    const init = fullData.weight;
    const step = definitionData.weightStep;
    const repCount = fullData.repetitionCount;
    let counter = init;
    let objId = uniqId.substr(0, uniqId.length) + counter.toString();
    repeatData.push({id: objId, key: init});
    for (let i = 1; i < repCount; ++i) {
      counter += step;
      objId = uniqId.substr(0, uniqId.length) + counter.toString();
      repeatData.push({id: objId, key: counter});
    }
    return repeatData;
  }

  repetitionElementOnPress(id) {
    let prevSelectedItems = this.state.selectedItems;
    const newSelectedItems = getUpdatedSelectedItemsArray(prevSelectedItems, id);
    this.setState({selectedItems: newSelectedItems});
  }

  checkIfExists(key) {
    return this.state.selectedItems.includes(key);
  }

  renderRepetitionEntity = ({item}) => {
    let style = { backgroundColor: this.checkIfExists(item.id) ? colors.LIGHT_BLUE : colors.TORCH_RED };
    return (<ListItem
      Component={TouchableOpacity}
      color={() => item.isChecked ? colors.LIGHT_BLUE : colors.TORCH_RED}
      title={item.key.toString()}
      style={style}
      onPress={() => this.repetitionElementOnPress(item.id) }
    />)
  };

  printOrderedList = (item) => {
    const innerData = item.definition;
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
            keyExtractor={this.selectedKeyExtractor}
          />
        </TouchableOpacity>
      </View>)
  };

  renderListItem = ({item}) => {
    return this.printOrderedList(item);
  };

  goBackToHomePress() {
    this.props.navigation.goBack();
  }

  renderFooter = () => {
    return (<Button
      title='Finish Training'
      onPress={() => this.goBackToHomePress()}
    />)
  };

  renderScreen = (trainData) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={trainData.trainData}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={this.renderFooter}
          extraData={this.state}
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
