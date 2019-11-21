import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../../constants/Colors';


class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const at = global.accessToken;

    if (at) {
      console.log(global.accessToken);
      console.log('Navigating');
      this.props.navigation.navigate('Start');
    } else {
      this.props.navigation.navigate('Login');
      return (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color={colors.LIGHT_BLUE}/>
        </View>
      );
    }
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

export default LoadingScreen;