import React from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
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
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
        onPress={() => navigation.navigate('Profile')}
      />
    ),
    headerRight: (
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
              navigation.navigate('Profile', {updated: true});
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }}/>
      </View>
    ),
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
      <View>
        <Text style={styles.name}>
          Username
        </Text>
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
      </View>
    );
  };

  renderFirstname = () => {
    return (
      <View>
        <Text style={styles.name}>
          First name
        </Text>
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
      </View>
    );
  };

  renderSecondname = () => {
    return (
      <View>
        <Text style={styles.name}>
          Second name
        </Text>
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
      </View>
    );
  };

  renderEmail = () => {
    return (
      <View>
        <Text style={styles.name}>
          Email
        </Text>
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
      </View>
    );
  };

  renderBirthday = () => {
    return (
      <View style={{ marginBottom: 38 }}>
        <Text style={styles.name}>
          Birth date
        </Text>
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
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginTop: 0,
              paddingLeft: 10,
            },
          }}
          onDateChange={this.handleBirthDateChange}
        />
      </View>
    );
  };

  renderHeight = () => {
    return (
      <View>
        <Text style={styles.name}>
          Height
        </Text>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.height}`}
          onChangeText={this.handleHeightChange}
          placeholder={strings.HEIGHT_PLACEHOLDER}
          autoCorrect={false}
          keyboardType='number-pad'
          returnKeyType="done"
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
      </View>
    );
  };

  renderWeight = () => {
    return (
      <View>
        <Text style={styles.name}>
          Weight
        </Text>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.weight}`}
          onChangeText={this.handleWeightChange}
          placeholder={strings.WEIGHT_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"

          keyboardType='number-pad'
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
      </View>
    );
  };

  renderGoal = () => {
    return (
      <View>
        <Text style={styles.name}>
          Goal
        </Text>
        <FormTextInput
          style={styles.textViewStyle}
          value={`${this.state.userData.goal}`}
          onChangeText={this.handleGoalChange}
          placeholder={strings.GOAL_PLACEHOLDER}
          autoCorrect={false}
          returnKeyType="done"

          keyboardType='number-pad'
          onSubmitEditing={this.handleKeyDown}
          blurOnSubmit={system.IS_IOS}
        />
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
          {this.renderUsername()}
          {this.renderFirstname()}
          {this.renderSecondname()}
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
      marginTop: 20,
      flex: 1,
      backgroundColor: colors.WHITE,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },
    icon: {
      paddingLeft: 10,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: 60,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.GREY,
      paddingLeft: 10,
    },
    textViewStyle: {
      paddingLeft: 5,
    },
  },
);

export default withNavigation(ProfileSettingsScreen);
