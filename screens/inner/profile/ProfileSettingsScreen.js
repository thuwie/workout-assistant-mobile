import React from 'react';
import { View, Text, Button, Platform, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import FormTextInput from '../../../components/FormTextInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    paddingLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 45,
  },
});

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
        <Icon type="ionicon" name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}/>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.props = props;
    this.userData = this.props.navigation.getParam('userData');
    this.state = { textInputs: [],};
  }

  renderItem = (item, index) => {
    const [key, value] = item;
    return (
      <View>
      <Text>{key}</Text>
      <FormTextInput
        value={this.state.textInputs[index]}
        onChangeText={text => {
          let { textInputs } = this.state;
          textInputs[index] = text;
          this.setState({textInputs});
        }}
      />
    </View>
    )
  };

  renderList = () => {
    return (
      <FlatList
        data={Object.entries(this.userData)}
        renderItem={({ item, index }) => this.renderItem(item, index)}
      />
    );
  };

  render() {
    return (
      <View>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        {this.renderList()}
      </View>
    );
  }
}


export default withNavigation(ProfileSettingsScreen);
