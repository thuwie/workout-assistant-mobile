import React from 'react';
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Avatar, ListItem, Overlay } from 'react-native-elements';
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
      isOverlayVisible: false,
      isLongtapOverlayVisible: false,
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
      this.setState({ markedDates });
      await request(userUrl, methods.PUT, { trainings });
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
    } catch (error) {
      console.log('error');
      console.log(error);
    }
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
          this.setState({ isOverlayVisible: false, pickedDay: null });
        }}
        key={_id}
        title={name}
        leftAvatar={this.renderAvatar(item)}
      />
    );
  };

  renderLongtapOverlayItem = ({ item }) => {
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

  renderPresetOverlay = () => {
    return (
      <Overlay
        isVisible={this.state.isOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        onBackdropPress={() => {
          this.setState({ isOverlayVisible: false, pickedDay: null });
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

  renderLongtapPresetOverlay = () => {
    let data = [];
    const pickedDay = this.state.pickedDay ? this.state.pickedDay.dateString : null;
    const filteredTrainings = this.state.userData.trainings.filter((training) => training.placed.includes(pickedDay));
    if (filteredTrainings.length > 0) {
      const presetId = filteredTrainings[0].presetId;
      const preset = this.state.userData.presets.filter((preset) => preset._id === presetId);
      if (preset.length > 0) {
        data.push(preset[0]);
      }
    }
    return (
      <Overlay
        isVisible={this.state.isLongtapOverlayVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        onBackdropPress={() => {
          this.setState({ isLongtapOverlayVisible: false, pickedDay: null });
        }}
      >
        <FlatList
          data={data}
          renderItem={this.renderLongtapOverlayItem}
          keyExtractor={this.keyExtractor}
        />
      </Overlay>
    );
  };

  handleDayTap = (dayObject) => {
    this.setState({ pickedDay: dayObject, isOverlayVisible: true });
  };

  handleLongtap = (dayObject) => {
    this.setState({ pickedDay: dayObject, isLongtapOverlayVisible: true });
  };

  renderCalendar = () => {
    return (
      <Calendar
        minDate={new Date()}
        maxDate={(new Date()).setMonth((new Date()).getMonth() + 1)}
        onDayPress={(day) => {
          console.log('selected day', day);
          this.handleDayTap(day);
        }}
        onDayLongPress={(day) => {
          if (this.state.markedDates[day.dateString]) {
            this.handleLongtap(day);
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
          {this.renderPresetOverlay()}
          {this.renderLongtapPresetOverlay()}
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
});
export default CalendarScreen;