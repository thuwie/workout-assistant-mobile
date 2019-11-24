import React from 'react';
import { View, Text, Button, Platform, StyleSheet, StatusBar } from 'react-native';
import { Icon } from "react-native-elements";
import { withNavigation } from 'react-navigation';
import ProfileScreen from './ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    paddingLeft: 10
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 45
  }
});

class ProfileSettingsScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
        onPress={() => navigation.navigate('Profile')}
      />
    ),
    headerRight: (
      <View style={styles.iconContainer}>
        <Icon type="ionicon" name={Platform.OS === "ios" ? "ios-checkmark" : "md-checkmark"} />
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (<View><StatusBar
      barStyle="dark-content"
      backgroundColor="#FFFFFF"
    /></View>);
  }
}


export default withNavigation(ProfileSettingsScreen);
