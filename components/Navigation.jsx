import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Navigation = () => {
  const navigation = useNavigation();
  const [user, setuser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get('http://192.168.232.209:3000/profile/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setuser(res.data);
      } catch (err) {
        console.error('Failed to load user:', err.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.navigation}>
      {/* Left Side - Profile */}
      <TouchableOpacity
        style={styles.userProfile}
        onPress={() => navigation.navigate('UserDetails')}
      >
        <View style={styles.userAvatar}>
          <Image
            source={{
              uri: user?.avatar || 'https://via.placeholder.com/40x40',
            }}
            style={styles.avatarImg}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullname || 'Loading...'}</Text>
          <Text style={styles.userStatus}>Protected</Text>
        </View>
      </TouchableOpacity>

      {/* Right Side - Emergency Contacts */}
      <TouchableOpacity
        style={styles.emergencyContacts}
        onPress={() => navigation.navigate('EmergencyContacts')}
      >
        <View style={styles.iconWrapper}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
            <Path
              d="M23 21v-2a4 4 0 0 0-3-3.87"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={styles.contactsLabel}>Emergency Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.5)',
    backgroundColor: '#7c3aed',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userStatus: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
  },
  emergencyContacts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  iconWrapper: {
    color: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactsLabel: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Navigation;
