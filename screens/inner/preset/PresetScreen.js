import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import colors from '../../../constants/Colors';
import {ListItem} from 'react-native-elements';
import {withNavigation} from "react-navigation";

class PresetScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  async componentDidMount() {
    try {
      await this.loadData();
      this.setState({isLoading: false});
    } catch (err) {
      console.log(err);
    }
  }

  loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      this.setState({userData: JSON.parse(userData)});
      console.log(userData);
    } catch (err) {
      console.log(err);
    }
  };

  keyExtractor = (item) => item._id.toString();

  renderItem = ({item}) => (
    <TouchableScale
      onPress={() => this.props.navigation.navigate("PresetItem", {itemData: item})}>
      <ListItem
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95} //
        key={item._id}
        title={item.name}
        bottomDivider/>
    </TouchableScale>
  );


  render() {
    if (this.state.isLoading)
      return (<View/>);
    return (
      <FlatList style={styles.list}
                data={this.state.userData.presets}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
      />);
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
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

export default withNavigation(PresetScreen);
