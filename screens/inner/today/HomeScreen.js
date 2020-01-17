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
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Avatar, ListItem, Button} from "react-native-elements";
import request from "../../../utils/customRequest";

const monthMap = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

const formatDate = (date) => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthMap[monthIndex] + ' ' + year;
};

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
      timePoint: {},
      today: new Date(),
    };
  }

  loadTrainingsData = async () => {
    try {
      const exerciseDictionaryUrl = global.apiUrl + '/exercise/dictionary/all';
      const exerciseDictionaryData = await request(exerciseDictionaryUrl, 'GET');

      const exerciseUrl = global.apiUrl + '/exercise/search?userId=' + global.userId;
      const exerciseData = await request(exerciseUrl, 'GET');

      const userData = await AsyncStorage.getItem('@user_data');
      this.setState({
        userData: JSON.parse(userData),
        exerciseDictionaryData,
        exerciseData,
        timePoint: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  getNextTraining(timePoint, strongOrder) {
    let currentDate = {};
    if(!timePoint)
      currentDate = new Date();
    else
      currentDate = timePoint;
    const trainings = this.state.userData.trainings;
    if(trainings.length === 0)
      return null;
    const exercisesDictionary = this.state.exerciseDictionaryData;
    if(exercisesDictionary.length === 0)
      return null;
    let nextTraining = {};
    if(strongOrder) {
      nextTraining = trainings
        .sort((a, b) => Date.parse(a.placed[0]) - Date.parse(b.placed[0]))
        .filter((train) => {
          let date = new Date(Date.parse(train.placed[0])).setHours(0, 0, 0, 0);
          let curDate = new Date(currentDate).setHours(0, 0, 0, 0);
          return date === curDate;
        });
    } else {
      nextTraining = trainings
        .sort((a, b) => Date.parse(a.placed[0]) - Date.parse(b.placed[0]))
        .filter((train) => {
          let date = new Date(Date.parse(train.placed[0])).setHours(0, 0, 0, 0);
          let curDate = new Date(currentDate).setHours(0, 0, 0, 0);
          return date >= curDate;
        });
    }
    if(nextTraining.length === 0)
      return null;
    const presetId = nextTraining[0].presetId;
    const preset = this.state.userData.presets.filter((preset) => preset._id === presetId);
    if(preset.length === 0)
      return null;
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
      this.props.navigation.addListener('willFocus', async () => { this.updateStorage();} );
      await this.loadTrainingsData();
      this.setState({
        isLoading: false,
        timePoint: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  refreshTrainingData = async (navigationData) => {
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

  onSwipeLeft = (agendaDate) => {
    let tomorrow = new Date(agendaDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setState({timePoint: tomorrow});
  };

  onSwipeRight = (agendaDate) => {
    const prevDate = new Date(agendaDate).setHours(0,0,0,0);
    const nextDate = new Date(this.state.today).setHours(0,0,0,0);
    if(prevDate <= nextDate)
      return;
    let yesterday = new Date(agendaDate);
    yesterday.setDate(yesterday.getDate() - 1);
    this.setState({timePoint: yesterday});
  };

  renderButton(trainData) {
    const agendaDate = new Date(trainData.agendaDate);
    const prevDate = new Date(agendaDate).setHours(0,0,0,0);
    const nextDate = new Date(this.state.today).setHours(0,0,0,0);
    if(prevDate > nextDate)
      return(<View/>);
    // if(agendaDate.getTime() < this.state.today)
    //   return(<View/>);
    return(
      <Button
        title="Start Training"
        onPress={() => this.props.navigation.navigate('CurrentTrain', {
          userData: this.state.userData,
          trainData: trainData,
          onGoBack: (param) => this.refreshTrainingData(),
        })}
      />
    )
  }

  renderNextScheduleDate(timePoint) {
    if(!timePoint)
      return(<Text style={styles.title}>Setup new train on the Calendar page.</Text>);
    return(
      <Text style={styles.title}>Next training date: {timePoint}.</Text>
    );
  };

  renderScreen = () => {
    const trainData = this.getNextTraining(this.state.timePoint, true);
    const mayBeNext = this.getNextTraining(this.state.timePoint, false);
    let timePoint = {};
    if (!trainData) {
      timePoint = formatDate(new Date(this.state.timePoint));
      let mayBeNextTimePoint = (mayBeNext) ? formatDate(new Date(mayBeNext.agendaDate)) : null;
      return (<GestureRecognizer style={styles.container}
                                 onSwipeLeft={() => this.onSwipeLeft(this.state.timePoint)}
                                 onSwipeRight={() => this.onSwipeRight(this.state.timePoint)}
        ><View>
          <Text h1 style={styles.happyMessage}>There are no trainings for {timePoint}!</Text>
          {this.renderNextScheduleDate(mayBeNextTimePoint)}
        </View>
        </GestureRecognizer>
      );
    }
    timePoint = formatDate(new Date(trainData.agendaDate));
    return (
      <GestureRecognizer style={styles.container}
                         onSwipeLeft={() => this.onSwipeLeft(this.state.timePoint)}
                         onSwipeRight={() => this.onSwipeRight(this.state.timePoint)}
      >
      <View>
        <Text style={styles.title}>This day agenda</Text>
        <Text style={styles.title}>{timePoint}</Text>
        <Text style={styles.title}>{trainData.presetName}</Text>
        <FlatList
          horizontal={true}
          data={trainData.trainData}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
        />
        {this.renderButton(trainData)}
      </View>
      </GestureRecognizer>
    );
  };


  render() {
    if (this.state.isLoading)
      return (<View/>);
    return this.renderScreen();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 1,
  },
  happyMessage: {
    fontSize: 35,
  },
  title: {
    fontSize: 25,
  },
  subTitle: {
    fontSize: 15,
  }
});

export default withNavigation(HomeScreen);
