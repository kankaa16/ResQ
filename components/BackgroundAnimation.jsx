import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BackgroundAnimation = () => {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  const animateOrb = (animRef, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animRef, {
          toValue: 1,
          duration: 5000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animRef, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateOrb(float1, 0);
    animateOrb(float2, 2500);
    animateOrb(float3, 4000);
  }, []);

  const floatTranslate = (value) => {
    return {
      transform: [
        {
          translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -40],
          }),
        },
        {
          translateX: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          }),
        },
      ],
      opacity: value.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.5],
      }),
    };
  };

  return (
    <View style={styles.background}>
      {/* Floating waves (soft gradient overlays) */}
      <Animated.View style={[styles.wave, styles.wave1]} />
      <Animated.View style={[styles.wave, styles.wave2]} />
      <Animated.View style={[styles.wave, styles.wave3]} />

      {/* Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, floatTranslate(float1)]} />
      <Animated.View style={[styles.orb, styles.orb2, floatTranslate(float2)]} />
      <Animated.View style={[styles.orb, styles.orb3, floatTranslate(float3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    borderRadius: width,
    backgroundColor: 'rgba(147, 51, 234, 0.03)',
  },
  wave1: {
    top: -height * 0.5,
    left: -width * 0.5,
  },
  wave2: {
    top: -height * 0.6,
    right: -width * 0.5,
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  wave3: {
    bottom: -height * 0.5,
    left: -width * 0.3,
    backgroundColor: 'rgba(147, 51, 234, 0.03)',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(147, 51, 234, 0.08)',
    top: height * 0.2,
    left: width * 0.1,
  },
  orb2: {
    width: 400,
    height: 400,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    top: height * 0.6,
    right: width * 0.15,
  },
  orb3: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    bottom: height * 0.3,
    left: width * 0.6,
  },
});

export default BackgroundAnimation;
