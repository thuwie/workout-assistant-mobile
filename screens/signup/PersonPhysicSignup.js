import React from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import strings from '../../constants/strings/en_Strings';
import colors from '../../constants/Colors';
import system from '../../constants/System';
import FormTextInput from '../../components/FormTextInput';
import Button from '../../components/Button';
import request from '../../utils/customRequest';

class PersonDataSignupScreen extends React.Component {
  heightInputRef = React.createRef();
  goalInputRef = React.createRef();

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      weight: '',
      goal: '',
      height: '',
    };
  }

  handleNextPress = async () => {
    const { weight, height, goal, } = this.state;
    const url = global.apiUrl + '/user/' + global.userId;
    console.log(weight, height, goal, url);
    try {
      const body = await request(url, 'PUT', {weight, height, goal,});
      this.props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  handleSkipPress = () => {
    this.props.navigation.navigate('Login');
  };

  handleWeightChange = weight => {
    this.setState({ weight });
  };

  handleHeightChange = height => {
    this.setState({ height });
  };

  handleGoalChange = goal => {
    this.setState({ goal });
  };

  handleWeightSubmitPress = () => {
    if (this.heightInputRef.current) {
      this.heightInputRef.current.focus();
    }
  };

  handleHeightSubmitPress = () => {
    if (this.goalInputRef.current) {
      this.goalInputRef.current.focus();
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.weight}
            onChangeText={this.handleWeightChange}
            onSubmitEditing={this.handleWeightSubmitPress}
            placeholder={strings.WEIGHT_PLACEHOLDER}
            autoCorrect={false}
            returnKeyType="next"
            keyboardType='number-pad'
            blurOnSubmit={system.IS_IOS}
          />
          <FormTextInput
            ref={this.heightInputRef}
            value={this.state.height}
            onChangeText={this.handleHeightChange}
            onSubmitEditing={this.handleHeightSubmitPress}
            placeholder={strings.HEIGHT_PLACEHOLDER}
            autoCorrect={false}
            keyboardType='number-pad'
            returnKeyType="next"
            blurOnSubmit={system.IS_IOS}
          />
          <FormTextInput
            ref={this.goalInputRef}
            value={this.state.goal}
            onChangeText={this.handleGoalChange}
            placeholder={strings.GOAL_PLACEHOLDER}
            autoCorrect={false}
            keyboardType='number-pad'
            returnKeyType="done"
            blurOnSubmit={system.IS_IOS}
          />
          <Button style={{ marginTop: 10 }} label={strings.FINISH} onPress={this.handleNextPress}/>
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, styles.signupText]} onPress={this.handleSkipPress}>Skip</Text>
          </View>
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
  skipContainer: { // TODO merge with sign up style
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

export default withNavigation(PersonDataSignupScreen);

