import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../../components/StyledText';

class CalendarScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <View>
        <Text>Calendar</Text>
      </View>
    );
  }
}

export default CalendarScreen;