import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import colors from '../../../constants/Colors';
import { ListItem, Overlay } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import FormTextInput from '../../../components/FormTextInput';
import strings from '../../../constants/strings/en_Strings';
import methods from '../../../constants/Methods';
import Button from '../../../components/Button';
import request from '../../../utils/customRequest';

class PresetScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOverlayVisible: false,
      newPreset: '',
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

  refresh = async (navigationData) => {
    try {
      const userData = this.state.userData;
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      await this.loadData();
    } catch (err) {
      console.log(err);
    }
  };

  handlePresetNameChange = newPreset => {
    this.setState({ newPreset });
  };

  handleCreatePress = async () => {
    const presetUrl = `${global.apiUrl}/preset`;
    const userUrl = `${global.apiUrl}/user/${global.userId}`;
    try {
      const userPresets = this.state.userData.presets;
      const response = await request(presetUrl, methods.POST, {
        exercises: [],
        trainings: [],
        name: this.state.newPreset,
        userId: global.userId,
      });
      userPresets.push(response);

      await request(userUrl, methods.PUT, {presets: userPresets});
      const userData = this.state.userData;
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      this.setState({isOverlayVisible: false, newPreset: ''});
      this.props.navigation.navigate('PresetItem', {
        itemData: response,
        goBack: (param) => this.refresh(param),
      })
    } catch (error) {
      console.log(error);
    }
  };

  renderOverlay = () => {
    // TODO Overlay recolors the StatusBar
    return (
      <Overlay
        isVisible={this.state.isOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="60%"
        height="auto"
        onBackdropPress={() => {
          this.setState({ newPreset: '', isOverlayVisible: false });
        }}
      >
        <View>
          <Text>Preset name:</Text>
          <FormTextInput
            style={{marginTop: 10}}
            value={this.state.newPreset}
            onChangeText={this.handlePresetNameChange}
            placeholder={strings.PRESETNAME_PLACEHOLDER}
            autoCorrect={false}
          />
          <Button style={{ marginTop: 10 }} label={strings.CREATE} onPress={this.handleCreatePress}/>
        </View>
      </Overlay>
    );
  };


  loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');

      this.setState({ userData: JSON.parse(userData) });
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
                onPress={() => this.setState({ isOverlayVisible: true })}
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
              onPress={() => this.props.navigation.navigate('PresetItem', {
                itemData: item,
                goBack: (param) => this.refresh(param),
              })}
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
              chevron={{ color: colors.BLACK, size: 30 }}
              title={item.name}/>
  );


  render() {
    if (this.state.isLoading) {
      return (<View/>);
    } else {
      return (
        <View>
          {this.renderOverlay()}
          <FlatList style={styles.list}
                    data={this.state.userData.presets}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ListFooterComponent={this.renderFooter}
          />
        </View>
      );
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.GREY,
    padding: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    fontWeight: 'bold',
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
