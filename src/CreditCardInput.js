import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  ViewPropTypes
} from 'react-native';

import CreditCard from './CardView';
import CCInput from './CCInput';
import { InjectedProps } from './connectToState';

const s = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  form: {
    marginTop: 20,
    paddingTop: 5
  },
  inputContainer: {
    marginLeft: 0
  },
  input: {
    height: 40
  }
});

let CVC_INPUT_WIDTH = 0;
if (Platform.OS === 'android') {
  CVC_INPUT_WIDTH = 80;
} else {
  CVC_INPUT_WIDTH = 70;
}
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get('window').width - EXPIRY_INPUT_WIDTH - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 80;

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    CVCInputWidth: PropTypes.number,
    expiryInputWidth: PropTypes.number,
    cardNumberInputWidthOffset: PropTypes.number,
    cardNumberInputWidth: PropTypes.number,
    nameInputWidth: PropTypes.number,
    previousFieldOffset: PropTypes.number,
    postalCodeInputWidth: PropTypes.number,

    cardImageFront: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cardImageBack: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    container: PropTypes.object,
    CVCInputStyle: PropTypes.object,
    expiryInputStyle: PropTypes.object,
    cardNumberInputStyle: PropTypes.object,
    cardImageSize: PropTypes.object,

    allowScroll: PropTypes.bool,
    renderScanView: PropTypes.func,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes))
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: 'CARD NUMBER',
      expiry: 'EXPIRY',
      cvc: 'CVC/CCV',
      postalCode: 'ZIP CODE'
    },
    placeholders: {
      name: 'Full Name',
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC',
      postalCode: '34567'
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: 'black'
    },

    CVCInputWidth: CVC_INPUT_WIDTH,
    expiryInputWidth: EXPIRY_INPUT_WIDTH,
    cardNumberInputWidthOffset: CARD_NUMBER_INPUT_WIDTH_OFFSET,
    cardNumberInputWidth: CARD_NUMBER_INPUT_WIDTH,
    nameInputWidth: NAME_INPUT_WIDTH,
    previousFieldOffset: PREVIOUS_FIELD_OFFSET,
    postalCodeInputWidth: POSTAL_CODE_INPUT_WIDTH,

    container: {},
    CVCInputStyle: {},
    expiryInputStyle: {},
    cardNumberInputStyle: {},
    cardImageSize: { width: 300, height: 190 },

    validColor: '',
    invalidColor: 'red',
    placeholderColor: 'gray',
    allowScroll: false,
    additionalInputsProps: {}
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    // const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      e => {
        throw e;
      },
      x => {
        // scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      }
    );
  };

  _inputProps = field => {
    const {
      inputStyle,
      labelStyle,
      placeholderLabelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeValid,
      additionalInputsProps,
      maxLengths
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle,
      placeholderLabelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      maxLength: maxLengths ? maxLengths[field] : 100,
      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeValid,
      additionalInputProps: additionalInputsProps[field]
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      container,
      cardImageSize,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      CVCInputStyle,
      expiryInputStyle,
      cardNumberInputStyle,
      nameInputStyle,
      postalCodeInputStyle,
      placeholderStyle,
      baseTextStyle,
      focusedStyle
    } = this.props;
    const width = Dimensions.get('window').width;
    return (
      <View style={[s.container, container]}>
        <CreditCard
          placeholderStyle={placeholderStyle}
          focusedStyle={focusedStyle}
          baseTextStyle={baseTextStyle}
          focused={focused}
          brand={type}
          scale={cardScale}
          baseSize={cardImageSize}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : ' '}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
        {this.props.renderScanView && this.props.renderScanView()}
        <ScrollView
          ref="Form"
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={[{ width: '100%', marginTop: 10 }]}
        >
          {requiresName && (
            <CCInput
              {...this._inputProps('name')}
              keyboardType="default"
              containerStyle={[
                s.inputContainer,
                { width: '100%', paddingBottom: 15 },
                inputContainerStyle,
                nameInputStyle
              ]}
            />
          )}

          <CCInput
            {...this._inputProps('number')}
            containerStyle={[s.inputContainer, { width: '100%' }, inputContainerStyle, cardNumberInputStyle]}
          />
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 15,
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <CCInput
              {...this._inputProps('expiry')}
              containerStyle={[s.inputContainer, { width: width * 0.26 }, inputContainerStyle, CVCInputStyle]}
            />
            {requiresCVC && (
              <CCInput
                {...this._inputProps('cvc')}
                containerStyle={[s.inputContainer, { width: width * 0.26 }, inputContainerStyle, expiryInputStyle]}
              />
            )}
            {requiresPostalCode && (
              <CCInput
                {...this._inputProps('postalCode')}
                containerStyle={[s.inputContainer, { width: width * 0.33 }, inputContainerStyle, postalCodeInputStyle]}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
