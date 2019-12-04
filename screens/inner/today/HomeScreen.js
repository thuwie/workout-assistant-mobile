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
import AsyncInterface from "../../../components/AsyncStorageInterface";
import request from "../../../utils/customRequest";


class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: {},
      exerciseStorage: [],
      trainingsIndex: [],
      exerciseDictionary: {},
    };
  }

  loadTrainingsData = async () => {
    try {

      let exerciseStorageData = {};
      let exerciseBody = {};
      let trainingsDateIndex = {};

      const storageState = await AsyncInterface.getStorageState();
      if (0 === storageState) {
        try {
          const exerciseUrl = global.apiUrl + '/exercise/search?userId=' + global.userId;
          const exerciseBody = await request(exerciseUrl, 'GET');
          await AsyncInterface.write(AsyncInterface.storageDictionary.exercise_storage, exerciseBody);
        } catch (error) {
          console.log(error.message);
        }
        exerciseStorageData = exerciseBody;
        trainingsDateIndex = await AsyncInterface.rebuildTrainIndex();
        await AsyncInterface.setStorageState(1);
      } else {
        exerciseStorageData = await AsyncInterface.read(AsyncInterface.storageDictionary.exercise_storage);
        trainingsDateIndex = await AsyncInterface.read(AsyncInterface.storageDictionary.train_date_index);
      }

      const userData = await AsyncInterface.read(AsyncInterface.storageDictionary.user_data);
      const dictRef = await AsyncInterface.read(AsyncInterface.storageDictionary.exercise_dictionary);

      this.setState({
        userData: userData,
        trainingsIndex: trainingsDateIndex,
        exerciseStorage: exerciseStorageData,
        exerciseDictionary: dictRef,
      });

    } catch (err) {
      console.log(err);
    }
  };


  getNextTraining() {
    const currentDate = new Date();
    const index = this.state.trainingsIndex;
    const nextTrainIndexEntry = index.find((item) => {
      return item.timestamp >= currentDate;
    });
    if (nextTrainIndexEntry === undefined)
      return undefined;
    const nextTrainId = nextTrainIndexEntry.train_id;
    const train = this.state.userData.trainings[nextTrainId];
    const preset = this.state.userData.presets.find((preset) => {
      return preset._id === train.presetId;
    });
    let newIndex = [];
    preset.exercises.forEach((index) => {
      const actualData = this.state.exerciseStorage.find((element) => element._id === index);
      actualData.excerciseDictionaryData = this.state.exerciseDictionary[actualData.exerciseDictionaryId];
      newIndex.push(actualData);
    });
    let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    let prettyDateFormat = new Date(nextTrainIndexEntry.timestamp);
    train.agendaDate = prettyDateFormat.toLocaleString('en-US', options);
    preset.exercises = newIndex;
    return {train, preset};
  }

  updateInvalidatedStorage = () => {
    // this.setState({isLoading: true});
  };

  async componentDidMount() {
    try {
      await this.loadTrainingsData();
      this.setState({isLoading: false});
      this.props.navigation.addListener('willFocus', this.updateInvalidatedStorage);
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidUpdate(P, A) {
    console.log('did update');
    try {
      const state = await AsyncInterface.getStorageState();
      if (0 === state) {
        await this.loadTrainingsData();
        this.setState({isLoading: false});
      }
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

  renderListItem = ({item}) => {
    const innerData = item.excerciseDictionaryData;
    return (
      <ListItem
        leftAvatar={this.renderAvatar(innerData)}
        key={item._id}
      />)
  };

  renderScreen = (trainData) => {
    return (
      <View style={styles.container}>
        <Text h1>Next training</Text>
        <Text h2>{trainData.train.agendaDate}</Text>
        <Text h3>{trainData.preset.name}</Text>
        <FlatList
          horizontal={true}
          data={trainData.preset.exercises}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
        />
        <Button
          title="Start"
          onPress={() => this.props.navigation.navigate('CurrentTrain', {trainData})}
        />
      </View>);
  };


  render() {
    if (this.state.isLoading)
      return (<View/>);
    const nextTrain = this.getNextTraining();
    if (nextTrain === undefined)
      return (<View/>);
    return this.renderScreen(nextTrain);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default withNavigation(HomeScreen);
