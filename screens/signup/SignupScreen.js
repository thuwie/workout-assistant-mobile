import React from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import strings from '../../constants/strings/en_Strings';
import colors from '../../constants/Colors';
import system from '../../constants/System';
import FormTextInput from '../../components/FormTextInput';
import Button from '../../components/Button';
import request from '../../utils/customRequest';

class SignupScreen extends React.Component {
  emailInputRef = React.createRef();
  passwordInputRef = React.createRef();

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: '',
      email: '',
      password: '',
      usernameTouched: false,
      emailTouched: false,
      passwordTouched: false,
    };
  }

  handleSignUpPress = async () => {
    const { username, password, email } = this.state;
    const url = global.apiUrl + '/signup';
    try {
      const body = await request(url, 'POST', {username, password, email});
      global.accessToken = body.accessToken;
      global.userId = body.userId;
      this.props.navigation.navigate('PersonDataSignup');
    } catch (error) {
      console.log(error);
    }
  };

  handleUsernameChange = username => {
    this.setState({ username });
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handleUsernameSubmitPress = () => {
    if (this.emailInputRef.current) {
      this.emailInputRef.current.focus();
    }
  };

  handleEmailSubmitPress = () => {
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

  render() {
    const {
      username,
      password,
      email,
      emailTouched,
      usernameTouched,
      passwordTouched,
    } = this.state;

    const usernameError = !username && usernameTouched ? strings.USERNAME_REQUIRED : undefined;
    const passwordError = !password && passwordTouched ? strings.PASSWORD_REQUIRED : undefined;
    const emailError = !email && emailTouched ? strings.EMAIL_REQUIRED : undefined;

    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        <View style={styles.form}>
          <FormTextInput
            ref={this.emailInputRef}
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            autoCorrect={false}
            returnKeyType="next"
            keyboardType='email-address'
            onBlur={this.handleEmailBlur}
            error={emailError}
            blurOnSubmit={system.IS_IOS}
          />
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
          <Button label={strings.SIGN_UP} onPress={this.handleSignUpPress}/>
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

export default withNavigation(SignupScreen);

