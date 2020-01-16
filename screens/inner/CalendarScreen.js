import React from 'react';
import { AsyncStorage, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Avatar, Icon, ListItem, Overlay } from 'react-native-elements';
import methods from '../../constants/Methods';
import request from '../../utils/customRequest';

class CalendarScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      let markedDates = {};
      JSON.parse(userData).trainings.forEach((training) => {
        training.placed.map((date) => {
          markedDates[date] = { marked: true };
        });
      });
      this.setState({ userData: JSON.parse(userData), markedDates });
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    try {
      await this.loadData();
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      markedDates: null,
      isLoading: true,
      isLongtapOverlayVisible: false,
      isTapOverlayVisible: false,
      userData: null,
      pickedDay: null,
    };
  }

  createTraining = async (preset) => {
    const { dateString } = this.state.pickedDay;
    const { _id, userId } = preset;
    const url = `${global.apiUrl}/training`;
    const userUrl = `${global.apiUrl}/user/${global.userId}`;
    const body = { presetId: _id, userId, placed: [dateString] };
    const trainings = this.state.userData.trainings;
    try {
      const markedDates = this.state.markedDates;
      const trainingObject = await request(url, methods.POST, body);
      trainings.push(trainingObject);
      markedDates[dateString] = { marked: true };

      const userData = this.state.userData;
      userData.trainings = trainings;
      this.setState({ markedDates, isTapOverlayVisible: false });
      await request(userUrl, methods.PUT, { trainings });
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  deleteTraining = async () => {
    const pickedDay = this.state.pickedDay ? this.state.pickedDay.dateString : null;
    const training = this.getTraining();
    console.log(training);
    if (training.length <= 0) {
      return;
    }
    const { _id } = training[0];
    const url = `${global.apiUrl}/training/${_id}`;
    const userUrl = `${global.apiUrl}/user/${global.userId}`;
    const userData = this.state.userData;
    const trainings = userData.trainings.filter((training) => !training.placed.includes(pickedDay));
    userData.trainings = trainings;
    const markedDates = this.state.markedDates;
    delete markedDates[pickedDay];
    try {
      await request(url, methods.DELETE);
      await request(userUrl, methods.PUT, { trainings });
      this.setState({ markedDates, isLongtapOverlayVisible: false });
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
    } catch (error) {
      console.log(error);
    }
  };

  getTraining = () => {
    const pickedDay = this.state.pickedDay ? this.state.pickedDay.dateString : null;
    return this.state.userData.trainings.filter((training) => training.placed.includes(pickedDay));
  };

  getPreset = () => {
    let data = [];
    const filteredTrainings = this.getTraining();
    if (filteredTrainings.length > 0) {
      const presetId = filteredTrainings[0].presetId;
      const preset = this.state.userData.presets.filter((preset) => preset._id === presetId);
      if (preset.length > 0) {
        data.push(preset[0]);
      }
    }
    return data;
  };

  keyExtractor = (item) => item._id.toString();

  renderAvatar = (exercise) => {
    const { name, icon } = exercise;
    if (icon) {
      return (
        <Avatar
          rounded
          size='small'
          source={{ uri: icon }}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          size='small'
          title={`${name.substring(0, 2).toUpperCase()}`}
          titleStyle={{ fontSize: 14 }}
        />
      );
    }
  };

  renderOverlayItem = ({ item }) => {
    const { _id, name } = item;
    return (
      <ListItem
        Component={TouchableOpacity}
        onPress={async () => {
          await this.createTraining(item);
          this.setState({ isLongtapOverlayVisible: false, pickedDay: null });
        }}
        key={_id}
        title={name}
        leftAvatar={this.renderAvatar(item)}
      />
    );
  };

  renderTapOverlayItem = ({ item }) => {
    const { _id, name } = item;
    return (
      <ListItem
        Component={TouchableOpacity}
        key={_id}
        title={name}
        leftAvatar={this.renderAvatar(item)}
      />
    );
  };

  renderDeleteOverlayItem = ({ item }) => {
    const { _id, name } = item;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ListItem
          style={[styles.subView, { width: 200 }]}
          Component={TouchableOpacity}
          key={_id}
          title={name}
          leftAvatar={this.renderAvatar(item)}
        />
        <View style={[styles.subView]}>
          <Icon
            containerStyle={[styles.icon, { marginRight: 30}]}
            type="ionicon"
            name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
            onPress={async () => {
              console.log('/');
              await this.deleteTraining(item);
            }}
          />
        </View>
      </View>
    );
  };

  renderViewOverlay = () => {
    const data = this.getPreset();
    return (
      <Overlay
        isVisible={this.state.isTapOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        transparent={false}
        onBackdropPress={() => {
          this.setState({ isTapOverlayVisible: false, pickedDay: null });
        }}
      >
        <FlatList
          data={data}
          renderItem={this.renderTapOverlayItem}
          keyExtractor={this.keyExtractor}
        />
      </Overlay>
    );
  };

  renderPickerOverlay = () => {
    return (
      <Overlay
        isVisible={this.state.isTapOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="80%"
        transparent={false}
        onBackdropPress={() => {
          this.setState({ isTapOverlayVisible: false, pickedDay: null });
        }}
      >
        <FlatList
          data={this.state.userData.presets}
          renderItem={this.renderOverlayItem}
          keyExtractor={this.keyExtractor}
        />
      </Overlay>
    );
  };

  renderDeleteOverlay = () => {
    const data = this.getPreset();
    return (
      <Overlay
        isVisible={this.state.isLongtapOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        transparent={false}
        onBackdropPress={() => {
          this.setState({ isLongtapOverlayVisible: false, pickedDay: null });
        }}
      >
        <FlatList
          data={data}
          renderItem={this.renderDeleteOverlayItem}
          keyExtractor={this.keyExtractor}
        />
      </Overlay>
    );
  };

  renderLongtapOverlay = () => {
    return this.renderDeleteOverlay();
  };

  renderTapOverlay = () => {
    const pickedDay = this.state.pickedDay ? this.state.pickedDay.dateString : null;
    const filteredTrainings = this.state.userData.trainings.filter((training) => training.placed.includes(pickedDay));
    return filteredTrainings.length > 0 ? this.renderViewOverlay() : this.renderPickerOverlay();
  };

  handleLongtapDay = (dayObject) => {
    this.setState({ pickedDay: dayObject, isLongtapOverlayVisible: true });
  };

  handleTapDay = (dayObject) => {
    this.setState({ pickedDay: dayObject, isTapOverlayVisible: true });
  };

  renderCalendar = () => {
    return (
      <Calendar
        minDate={new Date()}
        maxDate={(new Date()).setMonth((new Date()).getMonth() + 1)}
        onDayPress={(day) => {
          this.handleTapDay(day);

        }}
        onDayLongPress={(day) => {
          console.log('selected day', day);
          if (this.state.markedDates[day.dateString]) {
            this.handleLongtapDay(day);
          } else {
            console.log('long tap on empty day');
          }

        }}
        monthFormat={'MMMM yyyy'}
        onMonthChange={(month) => {
          console.log('month changed', month);
        }}
        hideExtraDays={true}
        disableMonthChange={true}
        markedDates={this.state.markedDates}
        firstDay={1}
        onPressArrowLeft={substractMonth => substractMonth()}
        onPressArrowRight={addMonth => addMonth()}
      />
    );
  };

  render() {
    LocaleConfig.locales['ru'] = {
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
      today: 'Сегодня',
    };
    // LocaleConfig.defaultLocale = 'ru';
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          {this.renderLongtapOverlay()}
          {this.renderTapOverlay()}
          {this.renderCalendar()}
        </View>
      );
    } else {
      return (<View/>);
    }
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  subView: {
    alignSelf: 'center',
  },
});
export default CalendarScreen;
