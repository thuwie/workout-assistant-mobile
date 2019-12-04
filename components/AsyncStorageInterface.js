import { AsyncStorage } from 'react-native';

export default class AsyncInterface {

  static storageState = {
    storage_state: '@storage_invalid',
    storage_failed: '@storage_failed',
    rebuild_timestamp: '@rebuild_timestamp',
  };

  static storageDictionary = {
    user_data: '@user_data',
    exercise_storage: '@exercise_storage',
    train_date_index: '@train_date_index',
    next_training: '@next_training',
    exercise_dictionary: '@exercises_dictionary'
  };

  static async write(key, item) {
    try {
      const jsonDataPromise = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonDataPromise;
    } catch (error) {
      console.log(error.message);
    }
  }

  static async read(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const actualItem = JSON.parse(retrievedItem);
      return actualItem;
    } catch (error) {
      console.log(error.message)
    }
  }

  static async setStorageState(flag) {
    await AsyncInterface.write(AsyncInterface.storageState.storage_state, flag);
  }

  static async getStorageState() {
    return AsyncInterface.read(AsyncInterface.storageState.storage_state);
  }

  // schema specific methods
  static async rebuildTrainIndex(userTrainings) {
    let trainings_ = {};
    if (userTrainings !== null)
      trainings_ = userTrainings;
    else {
      const { trainings } = await AsyncInterface.read(storageDictionary.user_data);
      trainings_ = trainings;
    }
    let dateIndex = [];
    trainings_.forEach((trainingItem, _id) => {
      const currDates = trainingItem.placed;
      currDates.forEach((currDate) => {
        const timestamp_tmp = Date.parse(currDate);
        const data = {timestamp: timestamp_tmp, train_id: _id};
        dateIndex.push(data);
      })
    });
    dateIndex.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
    const currTag = new Date();
    await AsyncInterface.write(AsyncInterface.storageDictionary.train_date_index, dateIndex);
    return dateIndex;
  }
}

