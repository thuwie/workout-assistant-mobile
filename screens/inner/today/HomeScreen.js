import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {withNavigation} from 'react-navigation';


class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: {},
      trainingsData: {},
      trainingsIndex: []
    };
  }

  loadTrainingsData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      const userTrainingsData = await AsyncStorage.getItem('@user_trainings');
      const trainingsDateIndex = await AsyncStorage.getItem('@train_date_index');

      this.setState({userData: JSON.parse(userData)});
      this.setState({userTrainings: JSON.parse(userTrainingsData)});
      this.setState({trainingsIndex: JSON.parse(trainingsDateIndex)});

    } catch (err) {
      console.log(err);
    }
  };


  getNextTraining() {
    const currentDate = new Date();
    const index = this.state.trainingsIndex;
    const nextTrain = index.find((item) => {
      return item.timestamp >= currentDate;
    });
    if (nextTrain === undefined)
      return undefined;
    const nextTrainId = nextTrain.train_id;
    return this.state.userTrainings[nextTrainId];
  }

  async componentDidMount() {
    try {
      await this.loadTrainingsData();
      this.setState({isLoading: false});
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.isLoading)
      return (<View/>);
    const nextTrain = this.getNextTraining();
    if (nextTrain === undefined)
      return (<View/>);
    return (<View/>);
  }

}

export default withNavigation(HomeScreen);
