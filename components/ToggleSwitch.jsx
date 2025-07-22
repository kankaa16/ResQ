import React from 'react';
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';

const ToggleSwitch = ({ checked, onChange }) => {
  const thumbPosition = React.useRef(new Animated.Value(checked ? 26 : 2)).current;

  React.useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: checked ? 26 : 2,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  return (
    <TouchableWithoutFeedback onPress={onChange}>
      <View style={[styles.toggleSwitch, checked && styles.active]}>
        <Animated.View style={[styles.toggleThumb, { left: thumbPosition }]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  toggleSwitch: {
    width: 60,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
  borderColor: '#bae6fd',    
  borderWidth: 2,
    justifyContent: 'center',
    position: 'relative',
    padding: 2,
  },
  active: {
  backgroundColor: '#93c5fd',
  borderColor: '#60a5fa',
  shadowColor: 'cyan',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
  },
  toggleThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    top: 2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});

export default ToggleSwitch;
