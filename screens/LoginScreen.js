import React from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Text, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';

import strings from '../constants/strings/en_Strings';
import colors from '../constants/Colors';
import system from '../constants/System';
import FormTextInput from '../components/FormTextInput';
import Button from '../components/Button';

import request from '../utils/customRequest';

class LoginScreen extends React.Component {
  passwordInputRef = React.createRef();

//'@user_id'access_token
  async componentDidMount() {
    if (global.userId && global.accessToken) {
      this.setState({ isLoading: true });
      await this.loadUserData();
    }
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: '',
      password: '',
      usernameTouched: false,
      passwordTouched: false,
      isLoading: false,
    };
  }

  handleUsernameChange = username => {
    this.setState({ username });
  };

  handleUsernameSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleUsernameBlur = () => {
    this.setState({ usernameTouched: true });
  };
  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  loadUserData = async () => {
    const usrUrl = global.apiUrl + '/user/' + global.userId;
    try {

      const usrBody = await request(usrUrl, 'GET');

      delete usrBody['password'];
      delete usrBody['__v'];

      await AsyncStorage.setItem('@user_data', JSON.stringify(usrBody));

      this.props.navigation.navigate('Start');
    } catch (error) {
      console.log(error);
    }

  };

  handleLoginPress = async () => {
    const { username, password } = this.state;
    const url = global.apiUrl + '/login';
    try {
      const body = await request(url, 'POST', { username, password });
      if (body.error) {
        return;
      }
      if(!body.accessToken) {
        return
      }
      global.accessToken = body.accessToken;
      global.userId = body.userId;
      await AsyncStorage.setItem('@user_id', body.userId);
      await AsyncStorage.setItem('@accessToken', body.accessToken);
      await this.loadUserData();
    } catch (error) {
      console.log(error);
    }
  };

  handleSignUpPress = () => {
    console.log('signup pressed');
    this.props.navigation.navigate('Signup');
  };

  render() {
    const {
      username,
      password,
      usernameTouched,
      passwordTouched,
    } = this.state;
    const usernameError = !username && usernameTouched ? strings.USERNAME_REQUIRED : undefined;
    const passwordError = !password && passwordTouched ? strings.PASSWORD_REQUIRED : undefined;

    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.username}
            onChangeText={this.handleUsernameChange}
            onSubmitEditing={this.handleUsernameSubmitPress}
            placeholder={strings.USERNAME_PLACEHOLDER}
            autoCorrect={false}
            returnKeyType="next"
            onBlur={this.handleUsernameBlur}
            error={usernameError}
            blurOnSubmit={system.IS_IOS}
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <Button label={strings.LOGIN} onPress={this.handleLoginPress}/>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New user? </Text>
            <Text style={[styles.registerText, styles.signupText]} onPress={this.handleSignUpPress}>Sign up</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({ // TODO the global stylesheet
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.GREY,
    alignSelf: 'center',
  },
  signupText: {
    color: colors.LIGHT_BLUE,
    alignSelf: 'center',
  },
});

export default withNavigation(LoginScreen);
