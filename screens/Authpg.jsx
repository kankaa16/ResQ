import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Auth = () => {
  const navigation = useNavigation();


  const BASE_URL = "https://resq-backend-p9s1.onrender.com";


  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmpassword: '',
    name: ''
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async () => {
  const { name, email, password, confirmpassword } = formData;

  if (!email || !password || (!isLogin && (!name || !confirmpassword))) {
    Toast.show({ type: 'error', text1: 'Please fill all fields.' });
    return;
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email)) {
    Toast.show({ type: 'error', text1: 'Please enter a valid Gmail address.' });
    return;
  }

  if (!isLogin) {
    // register logic
    if (password !== confirmpassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match.' });
      return;
    }

    try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
  fullname: name,
  email,
  pswd: password,
  confirmpswd: confirmpassword,
  gender: '',
  dob: '',
  avatar: '',
  phoneno: '',
  alternatephone: '',
  address: '',
  medicalconditions: '',
  allergies: '',
  bloodgrp: '',
  lastlocation: '',
  emergencycontacts: []
});

      const { message } = response.data;

      if (message !== "User registered successfully!") {
        Toast.show({ type: 'error', text1: message });
        return;
      }

      Toast.show({ type: 'success', text1: 'Registration successful!' });
      setIsLogin(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed!';
      Toast.show({ type: 'error', text1: msg });
    }
  } else {
    // login logic
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        pswd: password
      });

      const { message, token, user } = response.data;
      console.log(user.fullname);
      if (message !== "Login successful!") {
        Toast.show({ type: 'error', text1: message });
        return;
      }
//for saving user login info upto few days session storage!
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);


      Toast.show({ type: 'success', text1: 'Login successful!' });
      
      navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });

    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed!';
      Toast.show({ type: 'error', text1: msg });
    }
  }
};

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmpassword: '',
      name: ''
    });
  };

  const { width, height } = Dimensions.get('window');

  const orbAnim = new Animated.Value(0);
  Animated.loop(
    Animated.timing(orbAnim, {
      toValue: 1,
      duration: 8000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    })
  ).start();

  const orbFloat = orbAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/* Floating Orbs */}
        <View style={styles.orbContainer}>
          <Animated.View style={[styles.orb, styles.orbPink, {
            top: height * 0.2,
            left: width * 0.15,
            transform: [{ translateY: orbFloat }]
          }]} />
          <Animated.View style={[styles.orb, styles.orbPurple, {
            top: height * 0.6,
            right: width * 0.2,
            transform: [{ translateY: orbFloat }]
          }]} />
          <Animated.View style={[styles.orb, styles.orbBlue, {
            bottom: height * 0.3,
            left: width * 0.6,
            transform: [{ translateY: orbFloat }]
          }]} />
        </View>

        <Text style={styles.logo}>ResQ<Text style={styles.logoHighlight}>.</Text></Text>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join ResQ'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Sign in to access your safety network'
            : 'Create your account and stay protected'}
        </Text>

        {!isLogin && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>

        {!isLogin && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmpassword}
              onChangeText={(value) => handleInputChange('confirmpassword', value)}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text onPress={toggleAuthMode} style={styles.switchLink}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>

          {isLogin && (
            <TouchableOpacity>
              {/* <Text style={styles.forgot}>Forgot Password?</Text> */}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff', // soft sky tone
  },
  innerContainer: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#264653', // deep navy
  },
  logoHighlight: {
    color: '#8ecae6', // pastel blue
  },
  title: {
    fontSize: 28,
    color: '#2a2a2a',
    marginVertical: 12,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    color: '#111',
    borderColor: '#dbeafe',
    borderWidth: 1,
    shadowColor: '#e0e7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: '#8ecae6',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    shadowColor: '#bde0fe',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
  switchText: {
    color: '#555',
  },
  switchLink: {
    color: '#8ecae6',
    fontWeight: '600',
  },
  forgot: {
    color: '#888',
    marginTop: 10,
  },
  orbContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  orb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    opacity: 0.15,
  },
  orbPink: {
    backgroundColor: '#ffb3c6', // soft peachy pink
  },
  orbPurple: {
    backgroundColor: '#cdb4db', // lavender
  },
  orbBlue: {
    backgroundColor: '#a2d2ff', // sky pastel
  },
});


export default Auth;
