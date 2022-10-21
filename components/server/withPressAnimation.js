import React from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

const withPress = Component => class WithPress extends React.Component {
    static propTypes = {
      /**
       * Pass onPress handler
      */
      onPress: PropTypes.func,
      /**
       * Pass disabled handler
      */
      disabled: PropTypes.bool,
    };

    static defaultProps = {
      onPress: () => {},
      disabled: false,
    };
    constructor(props) {
      super(props);
      this.state = {
        animatedStartValue: new Animated.Value(1),
      }
    }
    

    handlePressIn = () => {
      const { animatedStartValue } = this.state;
      Animated.timing(
        animatedStartValue,
        {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        },
      ).start();
    }

    handlePressOut = () => {
      const { animatedStartValue } = this.state;
      Animated.timing(
        animatedStartValue,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        },
      ).start();
    }

    render() {
      const { onPress, disabled } = this.props;
      const { animatedStartValue } = this.state;
      const animatedStyle = {
        transform: [{ scale: animatedStartValue }],
        "width": "100%",
        backgroundColor: "transparent",
        borderRadius: 7.5,
      };

      return (
        <Animated.View style={animatedStyle}>
          <TouchableWithoutFeedback
            onPress={onPress}
            style={{
              borderRadius: 7.5,
              backgroundColor: "red"
            }}
            
            disabled={disabled}
          >
            <Component onPressOut={this.handlePressOut}  onPressIn={this.handlePressIn} {...this.props} />
          </TouchableWithoutFeedback>
        </Animated.View>
      );
    }
};

export default withPress;
