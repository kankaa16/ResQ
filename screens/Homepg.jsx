import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Navigation from '../components/Navigation.jsx';
import PanicButton from '../components/PanicButton.jsx';
import BackgroundAnimation from '../components/BackgroundAnimation.jsx';

const { width } = Dimensions.get('window');

const Homepg = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
    colors={['#f7faff', '#e6f4f1', '#fef6ff']}      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <BackgroundAnimation />
      <Navigation />

      <View style={styles.mainContent}>
        <View style={styles.heroSection}>
          <View style={styles.appTitle}>
            <Text style={styles.gradientText}>ResQ</Text>
            <Text style={styles.subtitle}>Your safety, our priority</Text>
          </View>

          <PanicButton />

          <View style={styles.statusWrapper}>
            <View style={styles.statusIndicator}>
              <Animated.View
                style={[
                  styles.statusDot,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={styles.statusText}>You are protected</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff', // Soft light blue
  },
  mainContent: {
    flex: 1,
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heroSection: {
    alignItems: 'center',
    gap: 48,
    padding: 32,
    maxWidth: 600,
    width: '100%',
  },
  appTitle: {
    alignItems: 'center',
  },
  gradientText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#264653',
    textShadowColor: 'rgba(142, 202, 230, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4a4e69',
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statusWrapper: {
    marginTop: 50,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(174, 226, 255, 0.25)', // soft blue tint
    borderColor: '#a0c4ff',
    borderWidth: 1,
    borderRadius: 25,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#38b000', // pastel green
    borderRadius: 50,
  },
  statusText: {
    color: '#2a9d8f', // calm teal
    fontSize: 14,
    fontWeight: '500',
  },
});
export default Homepg;
