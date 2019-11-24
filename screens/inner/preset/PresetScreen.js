import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {MonoText} from '../../components/StyledText';
import {withNavigation} from "react-navigation";
import colors from "../../constants/Colors";

//this.props.navigation.navigate('Start');
class PresetScreen extends React.Component {

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

  Item = (item) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("PresetItem")}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.isLoading)
      return (<View/>);
    return (
      <FlatList
        data={this.state.userData.presets}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("PresetItem")}>
              <View style={styles.item}>
                <Text style={styles.title}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item._id}
      />);
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
});

export default withNavigation(PresetScreen);
