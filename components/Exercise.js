import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, ListItem, Overlay } from 'react-native-elements';

class Exercise extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = { isVisible: true },
      this.props.exerciseData = {
        '5ddee73fb9a06c2ab4c85605': {
          'defaultWeight': 0,
          'description': 'Trynna steal your horse',
          'name': 'Rom Lift',
          //icon
        },
      };
  }

  renderAvatar = (exercise) => {
    const { name, icon } = exercise;
    if (icon) {
      return (
        <Avatar
          rounded
          size='medium'
          source={{ uri: icon }}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          size='medium'
          title={`${name.substring(0, 3).toUpperCase()}`}
          titleStyle={{ fontSize: 14 }}
        />
      );
    }
  };

  renderItem = ({ item }) => {
    const [id, exerciseDescription] = item;

    console.log(id, exerciseDescription);
    return (

      <ListItem
        Component={TouchableOpacity}
        onPress={() => this.setState({ isVisible: false })}
        key={id}
        leftAvatar={this.renderAvatar(exerciseDescription)}
        title={exerciseDescription.name}
        subtitle={exerciseDescription.description}
      />
      /*<View style={styles.item}>
        <View>
          {this.renderAvatar(exerciseDescription)}
        </View>
        <View style={styles.description}>
          <Text>{exerciseDescription.name}</Text>
          <Text>{exerciseDescription.description}</Text>
        </View>
      </View>*/
      /*  <ListItem
          roundAvatar
          // avatar={this.renderAvatar(exerciseDescription)}
          key={id}
          title={'blab'}
          subtitle={'asd'}
        />*/
    );
  };

  keyExtractor = ([id, object]) => id.toString();

  render() {
    const objects = Object.entries({
      '5ddee73fb9a06c2ab4c85605': {
        'defaultWeight': 0,
        'description': 'Trynna steal your horse',
        'name': 'Rom Lift',
        //icon
      },
      '5ddee767b9a06c2606': {
        'defaultWeight': 0,
        'description': 'Die hard',
        'name': 'Sumo Lift',
      },
    });
    console.log(objects);
    return (
      <Overlay
        isVisible={this.state.isVisible}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="80%"
        height="auto"
        onBackdropPress={() => {
          this.setState({ isVisible: false });
          this.state.array.push(id);
        }}
      >
        <FlatList
          data={objects}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {},
  description: {
    flexDirection: 'column',

  },
  subc: {
    width: '50%',
    alignItems: 'center',
  },
});
export default Exercise;