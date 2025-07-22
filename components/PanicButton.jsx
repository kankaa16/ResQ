import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing, Alert } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as SMS from 'expo-sms';

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';



const PanicButton = () => {
  const [isActivated, setIsActivated] = useState(true);
  const [msgsent, setmsgsent] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const ripple4 = useRef(new Animated.Value(0)).current;

  const animateRipple = (ripple, delay) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(ripple, {
          toValue: 1,
          duration: 2000,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(ripple, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (isActivated) {
      animateRipple(ripple1, 0);
      animateRipple(ripple2, 500);
      animateRipple(ripple3, 1000);
      animateRipple(ripple4, 1500);
    }
  }, [isActivated]);


const renderRipple = (rippleAnim) => {
  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });
  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          transform: [{ scale: rippleScale }],
          opacity: rippleOpacity,
        },
      ]}
    />
  );
};

const onPanicPress = async () => {
  setIsActivated(true); 
  setTimeout(() => {
  handlesos();
  setIsActivated(false); 
  }, 3000);
};

const handlesos = async () => {
  

  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = location.coords;
    const locationLink = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

    const token= await AsyncStorage.getItem("token")
    const response = await axios.get("http://192.168.232.209:3000/sos/sendmsg", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

      const { contacts, message } = response.data;


    if (!contacts || contacts.length === 0) {
      Alert.alert("No Contacts", "No emergency contacts found.");
      return;
    }




    const finalmessage = `${message}\n📍 Live location: ${locationLink}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      for (let i = 0; i < contacts.length; i++) {
        await SMS.sendSMSAsync([contacts[i]], finalmessage);
      }
    } else {
      Alert.alert("Error", "SMS service not available on this device.");
    }
    

  } 

   catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong.");
  }
};


  return (
    <View style={styles.container}>
    <Pressable style={styles.buttonWrapper} onPress={onPanicPress}>
        {isActivated && (
          <>
            {renderRipple(ripple1)}
            {renderRipple(ripple2)}
            {renderRipple(ripple3)}
            {renderRipple(ripple4)}
          </>
        )}
        <LinearGradient
          colors={isActivated ? ['#10b981', '#059669', '#34d399'] : ['#dc2626', '#ef4444', '#f87171']}
          style={[styles.button, isActivated && styles.activatedButton]}
        >
          {isActivated ? (
            <View style={styles.sentContent}>
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.sentText}>SENT</Text>
            </View>
          ) : (
            <View style={styles.sosContent}>
              <Text style={styles.sosText}>SOS</Text>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" />
                <Circle cx="12" cy="17" r="1" fill="white" />
              </Svg>
            </View>
          )}
        </LinearGradient>
      </Pressable>

      {showConfirmation && (
        <View style={styles.confirmation}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="10" r="3" stroke="#10b981" strokeWidth="2" />
          </Svg>
          <Text style={styles.confirmText}>Location sent to emergency contacts</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
    marginTop: 20,
    position: 'relative',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  activatedButton: {
    transform: [{ scale: 1.1 }],
  },
  sosContent: {
    alignItems: 'center',
    gap: 10,
  },
  sosText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 4,
  },
  sentContent: {
    alignItems: 'center',
    gap: 8,
  },
  sentText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#ef4444',
    zIndex:-1,
  },
  confirmation: {
    marginTop: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backdropFilter: 'blur(10px)', // only works with native backdrop API on web
  },
  confirmText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PanicButton;
