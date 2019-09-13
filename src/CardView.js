import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, ImageBackground, Text, StyleSheet, Platform } from 'react-native';

import defaultIcons from './Icons';
import FlipCard from 'react-native-flip-card';

const BASE_SIZE = { width: 300, height: 190 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 60,
    height: 40,
    resizeMode: 'contain'
  },
  baseText: {
    color: 'rgba(100, 0, 0, 0.8)',
    backgroundColor: 'transparent'
  },
  placeholder: {
    color: 'rgba(0, 0, 0, 0.5)'
  },
  focused: {
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)'
  },
  number: {
    fontSize: 21,
    position: 'absolute',
    top: 95,
    left: 28
  },
  name: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 100
  },
  expiryLabel: {
    fontSize: 9,
    position: 'absolute',
    bottom: 40,
    left: 218
  },
  expiry: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 220
  },
  amexCVC: {
    fontSize: 16,
    position: 'absolute',
    top: 73,
    right: 30
  },
  cvc: {
    fontSize: 16,
    position: 'absolute',
    top: 80,
    right: 30
  }
}); // https://github.com/yannickcr/eslint-plugin-react/issues/106

/* eslint react/prop-types: 0 */ export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    baseSize: PropTypes.object,
    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    imageBack: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    customIcons: PropTypes.object
  };

  static defaultProps = {
    name: '',
    placeholder: {
      number: '•••• •••• •••• ••••',
      name: 'FULL NAME',
      expiry: '••/••',
      cvc: '•••'
    },

    baseSize: BASE_SIZE,
    scale: 1,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    imageFront: { uri: 'card_front' },
    imageBack: { uri: 'card_back' }
  };

  renderAccessbilityLabel() {
    if (this.props.number && this.props.expiry) {
      return this.props.brand + '. Card Number' + this.props.number + 'Expiry Date' + this.props.expiry;
    }
    if (this.props.number) {
      return this.props.brand + '. Card Number' + this.props.number;
    }
    return '';
  }

  render() {
    const {
      focused,
      brand,
      name,
      number,
      expiry,
      cvc,
      customIcons,
      placeholder,
      imageFront,
      imageBack,
      scale,
      baseSize,
      fontFamily,
      placeholderStyle,
      focusedStyle,
      baseTextStyle
    } = this.props;
    s.placeholder = placeholderStyle;
    s.focused = focusedStyle;
    s.baseText = baseTextStyle;
    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === 'american-express';
    const shouldFlip = !isAmex && focused === 'cvc';

    const containerSize = { ...baseSize, height: baseSize.height * scale };
    const transform = {
      transform: [{ scale }, { translateY: (baseSize.height * (scale - 1)) / 2 }]
    };

    return (
      <View
        accessible={true}
        accessibilityLabel={this.renderAccessbilityLabel()}
        style={[s.cardContainer, containerSize]}
      >
        <FlipCard
          style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}
        >
          <ImageBackground style={[baseSize, s.cardFace, transform]} resizeMode="contain" source={imageFront}>
            <Image style={[s.icon]} source={Icons[brand]} />
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.number,
                !number && s.placeholder,
                focused === 'number' && s.focused
              ]}
            >
              {!number ? placeholder.number : number}
            </Text>
            <Text
              style={[s.baseText, { fontFamily }, s.name, !name && s.placeholder, focused === 'name' && s.focused]}
              numberOfLines={1}
            >
              {!name ? placeholder.name : name.toUpperCase()}
            </Text>
            <Text style={[s.baseText, { fontFamily }, s.expiryLabel, s.placeholder, focused === 'expiry' && s.focused]}>
              MONTH/YEAR
            </Text>
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.expiry,
                !expiry && s.placeholder,
                focused === 'expiry' && s.focused
              ]}
            >
              {!expiry ? placeholder.expiry : expiry}
            </Text>
            {isAmex && (
              <Text
                style={[s.baseText, { fontFamily }, s.amexCVC, !cvc && s.placeholder, focused === 'cvc' && s.focused]}
              >
                {!cvc ? placeholder.cvc : cvc}
              </Text>
            )}
          </ImageBackground>
          <ImageBackground style={[baseSize, s.cardFace, transform]} resizeMode="contain" source={imageBack}>
            <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === 'cvc' && s.focused]}>
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}
