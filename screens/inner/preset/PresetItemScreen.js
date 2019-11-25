import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Platform, TouchableOpacity, FlatList,
} from 'react-native';
import {Icon, ListItem} from "react-native-elements";

import {withNavigation} from "react-navigation";
import colors from "../../../constants/Colors";
import request from "../../../utils/customRequest";

class PresetItemScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Preset',
    headerLeft: (
      <Icon
        containerStyle={styles.icon}
        type="ionicon"
        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
        onPress={() => navigation.navigate('Preset')}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = { itemData: {}, exercises: {} };
  }

  getExerciseData = async (itemData) => {
    const { _id } = itemData;
    const url = global.apiUrl + '/preset/' + _id;
    console.log(url);
    try {
      const body = await request(url, 'GET');
      if (body.error) return;
      const { exercises } = body;
      this.setState({ exercises });
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const itemData = this.props.navigation.getParam('itemData');
      await this.getExerciseData(itemData);
      this.setState({ itemData });
    } catch (err) {
      console.log(err);
    }
  }

  keyExtractor = (item) => item._id.toString();

  renderItem = ({item}) => (
    <TouchableOpacity>
      <ListItem
        key={item._id}
        title={item.name}
        subtitle={item.description}
        bottomDivider/>
    </TouchableOpacity>
  );

  render() {
    return (
      <FlatList style={styles.list}
                data={this.state.exercises}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
      />);
  }
}

const styles = StyleSheet.create({
  item: {
    borderColor: colors.BLACK,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
  },
  itemTitle: {
    fontSize: 32,
    paddingLeft: 40,
  },
  list: {
    marginTop: 30,
  },
});

export default withNavigation(PresetItemScreen);
