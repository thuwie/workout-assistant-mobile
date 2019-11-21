import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/inner/HomeScreen';
import ProfileScreen from '../screens/inner/ProfileScreen';
import PresetScreen from '../screens/inner/PresetScreen';
import CalendarScreen from '../screens/inner/CalendarScreen';




const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ProfileStack = createStackNavigator({
    Profile: ProfileScreen,
  },
  config,
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? `ios-person` : 'md-person'
      }
    />
  ),
};

ProfileStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config,
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Today',
  tabBarIcon: ({ focused }) => (

    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-fitness' : 'md-fitness'}/>
  ),
};

HomeStack.path = '';

const PresetStack = createStackNavigator(
  {
    Preset: PresetScreen,
  },
  config,
);

PresetStack.navigationOptions = {
  tabBarLabel: 'Presets',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-clipboard' : 'md-clipboard'}/>
  ),
};

PresetStack.path = '';

const CalendarStack = createStackNavigator(
  {
    Calendar: CalendarScreen,
  },
  config,
);

CalendarStack.navigationOptions = {
  tabBarLabel: 'Calendar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}/>
  ),
};

PresetStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ProfileStack,
  HomeStack,
  PresetStack,
  CalendarStack,
});

tabNavigator.path = '';

export default tabNavigator;
