import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import { Card, Icon } from 'react-native-elements';
import colors from '../../../constants/Colors';

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = { isLoading: true };
  }

  async componentDidMount() {
    try {
      await this.loadData();
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  handleSettingsButton = () => {
    console.log('click');
    this.props.navigation.navigate('ProfileSettings', {userData: this.state.userData});
  };

  loadData = async () => {
    try {
      // const value = await AsyncStorage.getItem('@user_data');
      const value = '{firstName: "test", secondName:"test"}';
      // this.setState({ userData: JSON.parse(value) });
      this.setState({
        userData: {
          firstName: 'kir',
          secondName: 'kon',
          username: 'mock',
          height: 200,
          weight: 201,
          goal: 202,
          birthDate: '2000-01-01',
        },
      });
      console.log(value);
    } catch (err) {
      console.log(err);
    }
  };

  renderProfile = () => {
    const { firstName, secondName, username, birthDate, weight, height, goal } = this.state.userData;
    return (
      <View style={styles.container}>

        <View style={styles.header}>
        </View>
        <Icon onPress={this.handleSettingsButton} size={35} color={colors.SILVER} containerStyle={styles.icon} name={Platform.OS === 'ios' ? 'ios-settings' : 'settings'}/>
        <Image style={styles.avatar} source={require('../../../assets/images/icons8-question-mark-64.png')}/>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{firstName} {secondName}</Text>
            <Text style={styles.name}>@{username}</Text>
            <Text style={styles.description}>{birthDate}</Text>
            <Text style={styles.description}>Weight: {weight}</Text>
            <Text style={styles.description}>Height: {height}</Text>
            <Text style={styles.description}>Goal: {goal}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (<View/>);
    } else {
      return (
        <View>
          {this.renderProfile()}
        </View>
      );
    }

  }
}

ProfileScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.DODGER_BLUE,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  icon: {
    position: 'absolute',
    top:30,
    right:10,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    color: '#696969',
    marginTop: 30,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
});

export default ProfileScreen;
