import React from 'react';
import { StyleSheet, StatusBar, View, KeyboardAvoidingView, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import DatePicker from 'react-native-datepicker';

import strings from '../../constants/strings/en_Strings';
import colors from '../../constants/Colors';
import system from '../../constants/System';
import FormTextInput from '../../components/FormTextInput';
import Button from '../../components/Button';

class PersonDataSignupScreen extends React.Component {
  secondNameInputRef = React.createRef();
  bdateInputRef = React.createRef();

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      firstName: '',
      birthDate: '',
      secondName: '',
    };
  }

  handleNextPress = async () => {
    const { firstName, secondName, birthDate } = this.state;
    const url = global.apiUrl + '/user/' + global.userId;
    console.log(firstName, secondName, birthDate, url);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${global.accessToken}`,
        },
        body: JSON.stringify({
          firstName,
          secondName,
          birthDate,
        }),
      });
      this.props.navigation.navigate('PersonPhysicSignup');
    } catch (error) {
      console.log(error);
    }
  };

  handleSkipPress = () => {
    this.props.navigation.navigate('PresonPhysicSignup');
  };

  handleFirstnameChange = firstName => {
    this.setState({ firstName });
  };

  handleSecondNameChange = secondName => {
    this.setState({ secondName });
  };

  handleFirstnameSubmitPress = () => {
    if (this.secondNameInputRef.current) {
      this.secondNameInputRef.current.focus();
    }
  };

  handleSecondnameSubmitPress = () => {
    if (this.bdateInputRef.current) {
      this.bdateInputRef.current.focus();
    }
  };

  handleBirthDateChange = birthDate => {
    this.setState({ birthDate });
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
            value={this.state.firstName}
            onChangeText={this.handleFirstnameChange}
            onSubmitEditing={this.handleFirstnameSubmitPress}
            placeholder={strings.FIRSTNAME_PLACEHOLDER}
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={system.IS_IOS}
          />
          <FormTextInput
            ref={this.secondNameInputRef}
            value={this.state.secondName}
            onChangeText={this.handleSecondNameChange}
            onSubmitEditing={this.handleSecondnameSubmitPress}
            placeholder={strings.SECONDNAME_PLACEHOLDER}
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={system.IS_IOS}
          />
          <DatePicker
            style={{ width: '100%' }}
            date={this.state.birthDate}
            mode="date"
            placeholder={strings.BIRTHDAY_PLACEHOLDER}
            format="YYYY-MM-DD"
            minDate="1900-01-01"
            maxDate="2005-01-01"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                height: 40,
                borderColor: colors.SILVER,
                borderWidth: 0,
                flex: 1,
                alignItems: 'flex-start',
                width: '100%',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 20,
                marginBottom: 40,
              },
            }}
            onDateChange={this.handleBirthDateChange}
          />
          <Button style={{ marginTop: 10 }} label={strings.NEXT} onPress={this.handleNextPress}/>
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

