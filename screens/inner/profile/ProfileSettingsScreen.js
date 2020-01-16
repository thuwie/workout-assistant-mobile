import React from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView, AsyncStorage,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import FormTextInput from '../../../components/FormTextInput';
import strings from '../../../constants/strings/en_Strings';
import system from '../../../constants/System';
import colors from '../../../constants/Colors';
import methods from '../../../constants/Methods';
import DatePicker from 'react-native-datepicker';

import request from '../../../utils/customRequest';


class ProfileSettingsScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: (
      <TouchableOpacity>
        <View style={styles.iconContainer}>
          <Icon
            type="ionicon"
            name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity>
        <View style={styles.iconContainer}>
          <Icon
            type="ionicon"
            name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
            onPress={async () => {
              const { params = {} } = navigation.state;
              const { userData = {} } = params;
              console.log(userData);
              try {
                await this.saveToStorage(userData);
                const response = await this.updateUser(userData);
                if (response.error) {
                  throw new Error('Unauthorized');
                }
                navigation.navigate('Profile', { updated: true });
                console.log(response);
              } catch (error) {
                console.log(error);
              }
            }}/>
        </View>
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: 0,
      borderBottomWidth: 0,
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    }
  });

  async componentDidMount() {
    try {
      // const { firstName, secondName, username, birthDate, weight, height, goal } = this.props.navigation.getParam('userData');
      // this.setState({ firstName, secondName, username, birthDate, weight, height, goal });
      const userData = this.props.navigation.getParam('userData');
      this.setState({ userData });
    } catch (err) {
      console.log(err);
    }
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = { userData: {} };
    // this.state = { firstName: '', secondName: '', username: '', birthDate: '', weight: 0, height: 0, goal: 0 };
  }

  static async saveToStorage(userData) {
    return AsyncStorage.setItem('@user_data', JSON.stringify(userData));
  };

  static async updateUser(userData) {
    const url = global.apiUrl + '/user/' + global.userId;
    console.log(userData);
    return request(url, methods.PUT, userData);
  };

  handleKeyDown = () => {
    Keyboard.dismiss();
  };

  updateState = (field) => {
    const [pair] = Object.entries(field);
    const [key, value] = pair;
    if (key === 'height' || key === 'weight' || key === 'goal') {
      if (value !== '') {
        if (!(/^\d+$/.test(value))) {
          return;
        }
      }
    }
    const userData = this.state.userData;
    userData[key] = value;
    this.setState({ userData });
    this.props.navigation.setParams({ userData });
  };

  handleUsernameChange = username => {
    this.updateState({ username });
  };
  handleFirstnameChange = firstName => {
    this.updateState({ firstName });
  };
  handleSecondnameChange = secondName => {
    this.updateState({ secondName });
  };
  handleEmailChange = email => {
    this.updateState({ email });
  };
  handleBirthDateChange = birthDate => {
    this.updateState({ birthDate });
  };
  handleHeightChange = height => {
    this.updateState({ height });
  };
  handleWeightChange = weight => {
    this.updateState({ weight });
  };
  handleGoalChange = goal => {
    this.updateState({ goal });
  };

  renderUsername = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={this.state.userData.username}
          onChangeText={this.handleUsernameChange}
          placeholder={strings.USERNAME_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"
          editable={false}
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Username
        </Text>
      </View>
    );
  };

  renderFirstname = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={this.state.userData.firstName}
          onChangeText={this.handleFirstnameChange}
          placeholder={strings.FIRSTNAME_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          First name
        </Text>
      </View>
    );
  };

  renderSecondname = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={this.state.userData.secondName}
          onChangeText={this.handleSecondnameChange}
          placeholder={strings.SECONDNAME_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Second name
        </Text>
      </View>
    );
  };

  renderEmail = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={this.state.userData.email}
          onChangeText={this.handleEmailChange}
          placeholder={strings.SECONDNAME_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Email
        </Text>
      </View>
    );
  };

  renderBirthday = () => {
    return (
      <View style={[{ marginBottom: 38 }, styles.subContainer]}>
        <DatePicker
          style={{ width: '100%' }}
          date={this.state.userData.birthDate}
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
              marginTop: 0,
              paddingLeft: 10,
            },
            dateText: {
              fontSize: 20,
            },
          }}
          onDateChange={this.handleBirthDateChange}
        />
        <Text style={styles.name}>
          Birth date
        </Text>
      </View>
    );
  };

  renderHeight = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.height || ' '}`}
          onChangeText={this.handleHeightChange}
          placeholder={strings.HEIGHT_PLACEHOLDER}
          autoCorrect={false}
          keyboardType='numeric'
          returnKeyType="done"
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Height
        </Text>
      </View>
    );
  };

  renderWeight = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.weight || ' '}`}
          onChangeText={this.handleWeightChange}
          placeholder={strings.WEIGHT_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"

          keyboardType='number-pad'
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Weight
        </Text>
      </View>
    );
  };

  renderGoal = () => {
    return (
      <View style={styles.subContainer}>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.goal || ' '}`}
          onChangeText={this.handleGoalChange}
          placeholder={strings.GOAL_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"

          keyboardType='number-pad'
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
        <Text style={styles.name}>
          Goal
        </Text>
      </View>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <ScrollView>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#FFFFFF"
          />
          {this.renderFirstname()}
          {this.renderSecondname()}
          {this.renderEmail()}
          {this.renderBirthday()}
          {this.renderHeight()}
          {this.renderWeight()}
          {this.renderGoal()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: 20,
      marginTop: 20,
      flex: 1,
      backgroundColor: colors.WHITE,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: 60,
    },
    subContainer: {
      borderColor: colors.SILVER,
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: '100%',
      flex: 2,
      marginBottom: 20,
    },
    name: {
      fontSize: 14,
      color: colors.GREY,
      paddingLeft: 10,
      marginBottom: 10,
    },
    textViewStyle: {
      paddingLeft: 5,
      height: 30,
      borderColor: colors.SILVER,
      fontSize: 20,
      borderBottomWidth: 0,
      marginBottom: 2,
    },
  },
);

export default withNavigation(ProfileSettingsScreen);
