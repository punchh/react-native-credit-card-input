import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';

import { LabelTextInput } from 'react-native-punchh-components';

const s = StyleSheet.create({
  baseInputStyle: {
    color: 'black'
  }
});

let alreadyFocus = false;

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes)
  };

  static defaultProps = {
    label: '',
    value: '',
    status: 'incomplete',
    keyboardType: 'numeric',
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {}
  };

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    !!value && this.refs.input.setDirty();
    if (value !== '' && newValue === '') onBecomeEmpty(field);
    if (status !== 'valid' && newStatus === 'valid') onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => {
    if (!alreadyFocus) {
      alreadyFocus = true;
      this.props.onFocus(this.props.field);
      setTimeout(() => (alreadyFocus = false), 200);
    }
  };
  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const {
      label,
      value,
      placeholder,
      status,
      keyboardType,
      containerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholderLabelStyle,
      additionalInputProps,
      maxLength
    } = this.props;

    return (
      <TouchableOpacity onPress={this.focus} activeOpacity={0.99}>
        <View
          style={[
            containerStyle,
            validColor && status === 'valid'
              ? { borderColor: validColor }
              : invalidColor && status === 'invalid'
              ? { borderColor: invalidColor }
              : {}
          ]}
        >
          <LabelTextInput
            ref="input"
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            inputStyle={[s.baseInputStyle, inputStyle]}
            labelStyle={labelStyle}
            placeholderLabelStyle={placeholderLabelStyle}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onFocus={this._onFocus}
            onChangeText={this._onChange}
            label={label}
            placeholder={''}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
