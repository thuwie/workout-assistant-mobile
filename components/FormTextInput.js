import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import colors from '../constants/Colors';

export default class FormTextInput extends Component {
  textInputRef = React.createRef();

  constructor(props) {
    super(props);
    this.props = props;
  }

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  render() {
    const { style, error, ...otherProps } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colors.DODGER_BLUE}
          style={[styles.textInput, style]}
          {...otherProps}
        />
        <Text style={styles.errorText}>{error || ''}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  container: {
    marginBottom: 10,
  },
  errorText: {
    height: 20,
    color: colors.TORCH_RED,
  },
});