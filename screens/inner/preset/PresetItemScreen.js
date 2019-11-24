import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Icon } from "react-native-elements";

import {withNavigation} from "react-navigation";

class PresetItemScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
        onPress={() => navigation.navigate('Preset')}
      />
    ),
    headerRight: (
      <View style={styles.iconContainer}>
        <Icon type="ionicon" name={Platform.OS === "ios" ? "ios-checkmark" : "md-checkmark"} />
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  async componentDidMount() {
    try {
      await this.loadData();
      this.setState({isLoading: false});
    } catch (err) {
      console.log(err);
    }
  }

  loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      this.setState({userData: JSON.parse(userData)});
      console.log(userData);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return(<View/>);
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  item: {
    backgroundColor: '#75e3ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  icon: {
    paddingLeft: 10
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 45
  }
});

export default withNavigation(PresetItemScreen);
