import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { BaseToast } from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPg from './screens/LandingPg.jsx';
import Authpg from './screens/Authpg.jsx';
import Homepg from './screens/Homepg.jsx';
import Details from './screens/Details.jsx';
import Contacts from './screens/Contacts.jsx';

const Stack = createNativeStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#1f2937',  // Dark toast
        borderLeftColor: '#22c55e', // Green bar
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ color: '#f9fafb', fontWeight: 'bold' }}
      text2Style={{ color: '#d1d5db' }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#1f2937',
        borderLeftColor: '#ef4444',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ color: '#fef2f2', fontWeight: 'bold' }}
      text2Style={{ color: '#fca5a5' }}
    />
  ),
};


export default function App() {

  const [initialRoute, setInitialRoute] = useState(null); // here, null means loading...

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        if (token && user) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Landing');
        }
      } catch (err) {
        console.log("Error checking login:", err);
        setInitialRoute('Landing');
      }
    };

    checkLogin();
  }, []);

  if (!initialRoute) return null;

  return (
    <>
      <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Landing" component={LandingPg}  />
        <Stack.Screen name="Auth" component={Authpg} />
        <Stack.Screen name="Home" component={Homepg} />
       <Stack.Screen name="EmergencyContacts" component={Contacts} />       
       <Stack.Screen name="UserDetails" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
     
     
     <Toast config={toastConfig}/>
    </>
  );
}
