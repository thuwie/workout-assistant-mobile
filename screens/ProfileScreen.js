import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>
          Profile screen
        </Text>
      </View>
    </View>
  );
}

ProfileScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});
