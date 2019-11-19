import {Platform} from 'react-native';

export default {
  IS_DEV: __DEV__,
  IS_IOS: Platform.OS === 'ios',
  IS_DEBUG: Boolean(window.navigator.userAgent),
}