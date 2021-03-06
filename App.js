import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from './screens/LoginScreen';
import StartScreen from './screens/inner/StartScreen';
import SignupScreen from './screens/signup/SignupScreen';
import PersonDataSignupScreen from './screens/signup/PersonDataSignup';
import PersonPhysicSignupScreen from './screens/signup/PersonPhysicSignup';
import MainTabNavigator from './navigation/MainTabNavigator';

import customRequest from './utils/customRequest';
import methods from './constants/Methods';

const AppNavigator = createStackNavigator(
  {
    Start: MainTabNavigator,
    Signup: { screen: SignupScreen },
    PersonDataSignup: { screen: PersonDataSignupScreen },
    PersonPhysicSignup: { screen: PersonPhysicSignupScreen },
    Login: { screen: LoginScreen },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default function App(props) {
  global.apiUrl = 'http://85.143.217.110:8089/api';
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
        <AppContainer/>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
    prepareDictionary(),
    loadUser(),
  ]);
}

async function prepareDictionary() {
  const url = `${global.apiUrl}/exercise/dictionary/all`;
  const resp = await customRequest(url, methods.GET);
  const builded = {};
  resp.map(({ _id, defaultWeight, description, name, maximumWeight, weightStep }) => {
    builded[_id] = { defaultWeight, description, name, maximumWeight, weightStep };
  });
  await AsyncStorage.setItem('@exercises_dictionary', JSON.stringify(builded));
}

async function loadUser() {
  const keys = await AsyncStorage.getAllKeys();
  if (keys.indexOf('@user_id')) {
    global.userId = await AsyncStorage.getItem('@user_id');
  }
  if (keys.indexOf('@access_token')) {
    global.accessToken = await AsyncStorage.getItem('@access_token');
  }
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
