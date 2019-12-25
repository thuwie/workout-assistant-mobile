import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  AsyncStorage, StatusBar, ScrollView,
} from 'react-native';

import { ListItem, Icon, Avatar } from 'react-native-elements';
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
      this.setState({ isLoading: false, updated: false });
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidUpdate() {
    const updated = this.props.navigation.getParam('updated');
    if (updated) {
      try {
        await this.loadData();
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleSettingsButton = () => {
    console.log('click');
    this.props.navigation.navigate('ProfileSettings', { userData: this.state.userData });
  };
  handleExitButton = async () => {
    console.log('click');
    global.userId = '';
    global.accessToken='';
    await AsyncStorage.removeItem('@user_id');
    await AsyncStorage.removeItem('@access_token');
    this.props.navigation.navigate('Login');
  };

  loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user_data');
      // const value = '{firstName: "test", secondName:"test"}';
      this.setState({ userData: JSON.parse(value) });
      // this.setState({
      //   userData: {
      //     firstName: 'kir',
      //     secondName: 'kon',
      //     username: 'mock',
      //     email: 'mail',
      //     height: 200,
      //     weight: 201,
      //     goal: 202,
      //     birthDate: '2000-01-01',
      //   },
      // });
    } catch (err) {
      console.log(err);
    }
  };

  renderAvatar = () => {
    return (
      <Avatar
        size='large'
        rounded
        title={`${(this.state.userData.firstName[0]).toUpperCase()}${(this.state.userData.secondName[0]).toUpperCase()}`}
      />
    );
  };

  renderProfile = () => {
    const { firstName, secondName, username, birthDate, weight, height, goal, email } = this.state.userData;
    return (
      <View>
          <ListItem
            key={0}
            title={'@'+username}
            bottomDivider
          />
          <ListItem
            key={1}
            title={firstName}
            subtitle={'First name'}
            bottomDivider
          />
          <ListItem
            key={2}
            title={secondName}
            subtitle={'Second name'}
            bottomDivider
          />
          <ListItem
            key={3}
            title={email}
            subtitle={'Email'}
            bottomDivider
          />
          <ListItem
            key={4}
            title={birthDate}
            subtitle={'Birth date'}
            bottomDivider
          />
          <ListItem
            key={5}
            title={height}
            subtitle={'Height'}
            bottomDivider
          />
          <ListItem
            key={6}
            title={weight}
            subtitle={'Weight'}
            bottomDivider
          />
          <ListItem
            key={7}
            title={goal}
            subtitle={'Goal'}
          />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (<View/>);
    } else {
      return (
        <ScrollView>
          <View style={styles.container}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#FFFFFF"
            />
            <View style={styles.headContainer}>
              <View style={[styles.headSubContainer, { alignItems: 'flex-end' }]}>
                <Icon onPress={this.handleSettingsButton} size={35} color={colors.GREY} containerStyle={styles.icon}
                      name={'settings'}/>
                <Icon onPress={this.handleExitButton} size={35} color={colors.GREY} containerStyle={styles.icon}
                      name={'exit'}/>
              </View>
              <View style={styles.headSubContainer}>
                {this.renderAvatar()}
              </View>
            </View>
            <View style={styles.infoContainer}>
              {this.renderProfile()}
            </View>
          </View>
        </ScrollView>
      );
    }

  }
}

ProfileScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
    flexDirection: 'column',
  },
  headContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 2,
    width: '100%',
  },
  headSubContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avatarContainer: {
    flexGrow: 1,
    flexShrink: 1,
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
