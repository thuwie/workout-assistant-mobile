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
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class PresetScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
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
      // const userData = await AsyncStorage.getItem('@user_data');
      const userData = {
        'presets': [{
          'exercises': ['5ddfff926ebc1e2018cf2982'],
          'trainings': [],
          '_id': '5ddae6a290992131dc04dbc7',
          'userId': '5ddad8ab90992131dc04dbc5',
          'name': 'Bullshit',
          '__v': 0,
        }, {
          'exercises': ['5ddac2b690992131dc04dbc2'],
          'trainings': [],
          '_id': '5ddae68c90992131dc04dbc6',
          'userId': '5ddab3af90992131dc04dbc1',
          'name': 'Bullshit',
          '__v': 0,
        }, {
          'exercises': [],
          'trainings': [],
          '_id': '5ddaea4e90992131dc04dbc8',
          'userId': '5ddad8ab90992131dc04dbc5',
          'name': 'Bullshit Two',
          '__v': 0,
        }, {
          'exercises': [],
          'trainings': [],
          '_id': '5ddaea5790992131dc04dbc9',
          'userId': '5ddad8ab90992131dc04dbc5',
          'name': 'Bullshit Awesome',
          '__v': 0,
        }],
        'trainings': [],
        '_id': '5ddad8ab90992131dc04dbc5',
        'username': 'Ronin',
        'email': 'Ui@gmail.com',
        'birthDate': '2005-01-01T00:00:00.000Z',
        'firstName': 'R',
        'secondName': 'Rхахахахах',
      };
      global.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJvbmluIiwiZW1haWwiOiJVaUBnbWFpbC5jb20iLCJpYXQiOjE1NzUwNTIyNDF9._B1Fsu0WiEL5IKAUKcQAsbDUSf_xhCYVi40vOHrhgSQ';
      global.userId = '5ddad8ab90992131dc04dbc5';
      this.setState({ userData });
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
                  backgroundColor: colors.BLACK,
                }}
      />
    );
  };

  renderItem = ({ item }) => (
    <ListItem style={styles.item}
              Component={TouchableOpacity}
              onPress={() => this.props.navigation.navigate('PresetItem', { itemData: item })}
              friction={90}
              tension={100}
              activeScale={0.95}
              key={item._id}
              leftIcon={{
                name: 'bookmark',
                color: colors.BLACK,
                size: 30,
                backgroundColor: colors.BLACK,
              }}
              chevron={{color: colors.BLACK, size: 30}}
              title={item.name}/>
  );


  render() {
    if (this.state.isLoading) {
      return (<View/>);
    } else {
      return (
        <FlatList style={styles.list}
                  data={this.state.userData.presets}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ListFooterComponent={this.renderFooter}
        />);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  item: {
    borderColor: colors.GREY,
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
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
