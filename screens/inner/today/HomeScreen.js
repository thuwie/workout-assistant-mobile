import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Avatar, ListItem, Button} from "react-native-elements";
import request from "../../../utils/customRequest";


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: {},
      selectedItems: [],
    };
  }

  loadTrainingsData = async () => {
    try {
      const exerciseDictionaryUrl = global.apiUrl + '/exercise/dictionary/all';
      const exerciseDictionaryData = await request(exerciseDictionaryUrl, 'GET');

      const exerciseUrl = global.apiUrl + '/exercise/search?userId=' + global.userId;
      const exerciseData = await request(exerciseUrl, 'GET');

      const userData = await AsyncStorage.getItem('@user_data');
      this.setState({ userData: JSON.parse(userData)});
      this.setState({exerciseDictionaryData: exerciseDictionaryData});
      this.setState({exerciseData:exerciseData});

    } catch (err) {
      console.log(err);
    }
  };

  getNextTraining(timePoint = null) {
    let currentDate = {};
    if(timePoint === null)
      currentDate = new Date().setHours(0, 0, 0, 0);
    else
      currentDate = timePoint;
    const trainings = this.state.userData.trainings;
    if(trainings.length === 0)
      return undefined;
    const exercisesDictionary = this.state.exerciseDictionaryData;
    if(exercisesDictionary.length === 0)
      return undefined;
    const nextTraining = trainings.filter((train) => Date.parse(train.placed[0]) >= currentDate);
    if(nextTraining.length === 0)
      return undefined;
    const presetId = nextTraining[0].presetId;
    const preset = this.state.userData.presets.filter((preset) => preset._id === presetId);
    if(preset.length === 0)
      return undefined;
    let actualExercises = {
      trainId: nextTraining[0]._id,
      agendaDate: nextTraining[0].placed[0],
      presetName: preset[0].name,
      trainData: [],
    };
    preset[0].exercises.forEach((exerciseId) => {
      const exerciseFullData = this.state.exerciseData.filter((exercise) => exercise._id === exerciseId);
      const exerciseDefinition = exercisesDictionary.filter((definition) =>
        definition._id === exerciseFullData[0].exerciseDictionaryId);
      const exercise = {
        id: exerciseFullData[0]._id,
        exerciseFullData: exerciseFullData[0],
        definition: exerciseDefinition[0]
      };
      actualExercises.trainData.push(exercise);
    });
    return actualExercises;
  }

  updateStorage = async () => {
    await this.loadTrainingsData();
  };

  async componentDidMount() {
    try {
      await this.loadTrainingsData();
      this.props.navigation.addListener('willFocus', async () => { this.updateStorage();} );
      this.setState({isLoading: false});
    } catch (err) {
      console.log(err);
    }
  };

  refreshTrainigData = async (navigationData) => {
    try {
      await this.loadTrainingsData();
    } catch (err) {
      console.log(err);
    }
  };

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

  keyExtractor = (item) => item.id.toString();

  renderListItem = ({item}) => {
    const innerData = item.definition;
    return (
      <ListItem
        leftAvatar={this.renderAvatar(innerData)}
        key={item._id}
      />)
  };

  renderScreen = (trainData) => {
    return (
      <View style={styles.container}>
        <Text h1 style={styles.title}>Agenda</Text>
        <Text h2>{trainData.agendaDate}</Text>
        <Text h3>{trainData.presetName}</Text>
        <FlatList
          horizontal={true}
          data={trainData.trainData}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
        />
        <Button
          title="Start Training"
          onPress={() => this.props.navigation.navigate('CurrentTrain', {
            userData: this.state.userData,
            trainData: trainData,
            onGoBack: (param) => this.refreshTrainigData(),
          })}
        />
      </View>);
  };


  render() {
    if (this.state.isLoading)
      return (<View/>);
    const nextTrain = this.getNextTraining();
    if (nextTrain === undefined)
      return (<View style={styles.container}>
        <Text h1 style={styles.happyMessage}>There are no trainings today, enjoy your day!</Text>
      </View>);
    return this.renderScreen(nextTrain);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  happyMessage: {
    fontSize: 35,
  },
  title: {
    fontSize: 25,
  }
});

export default withNavigation(HomeScreen);
