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

  renderFooter = () => {
    return (
      <ListItem style={styles.item}
        Component={TouchableOpacity}
        title="Add new preset"
        leftIcon={{
          name: 'add',
          color: colors.BLACK,
          size: 30,
          backgroundColor: colors.BLACK}}
      />
    );
  };

  renderItem = ({item}) => (
    <ListItem style={styles.item}
              Component={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("PresetItem", {itemData: item})}
              friction={90}
              tension={100}
              activeScale={0.95}
              key={item._id}
              leftIcon={{
                name: 'bookmark',
                color: colors.BLACK,
                size: 30,
                backgroundColor: colors.BLACK}}
              title={item.name}/>
  );


  render() {
    if (this.state.isLoading)
      return (<View/>);
    return (
      <FlatList style={styles.list}
                data={this.state.userData.presets}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListFooterComponent={this.renderFooter}
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
