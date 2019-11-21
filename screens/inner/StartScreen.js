import React from 'react';
import {
  View,
  Text,
  BackHandler,
  ToastAndroid,
} from 'react-native';

import FlatNavigator from '../../navigation/FlatNavigator';

export default class StartScreen extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    return this.props.navigation.isFocused();
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatNavigator/>
    );
  }
}