import React from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import { Card, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import strings from '../../constants/strings/en_Strings';
import colors from '../../constants/Colors';
import resources from '../../constants/Resources';
import system from '../../constants/System';

import FormTextInput from '../../components/FormTextInput';
import Button from '../../components/Button';
import Separator from '../../components/Separator';

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

  loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user_data');
      this.setState({ userData: JSON.parse(value) });
      console.log(value);
    } catch (err) {
      console.log(err);
    }
  };

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground source={require('../../assets/images/background.jpg')}
                         style={styles.headerBackgroundImage}
                         blurRadius={5}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={require('../../assets/images/icons8-question-mark-64.png')}
            />
            <Text style={styles.userNameText}>{this.state.userData.firstName}</Text>
          </View>
        </ImageBackground>
      </View>
    );

  };

  render() {
    if (this.state.isLoading) {
      return (<View/>);
    } else {
      return (
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Card containerStyle={styles.cardContainer}>
              {this.renderHeader()}
              {Separator()}
            </Card>
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
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 100,
    paddingTop: 35,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: colors.LIGHT_BLUE,
    borderRadius: 85,
    borderWidth: 2,
    height: 120,
    marginTop: 10,
    marginBottom: 15,
    width: 120,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
});


export default ProfileScreen;
