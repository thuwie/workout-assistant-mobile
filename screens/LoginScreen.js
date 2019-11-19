import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView } from 'react-native';

import strings from '../constants/Strings';
import colors from '../constants/Colors';
import system from '../constants/System';
import FormTextInput from '../components/FormTextInput';
import Button from '../components/Button';

export default class LoginScreen extends Component {
  passwordInputRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameTouched: false,
      passwordTouched: false,
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

  handleLoginPress = () => {
    console.log('login pressed');
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
            value={this.state.email}
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
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
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
});
