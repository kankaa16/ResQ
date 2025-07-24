import axios from 'axios';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEffect,useState } from 'react';

const ProfileSummary = ({ editMode, onEditToggle}) => {

  const navigation = useNavigation();


  



  const handlelogout = async () => {
    try {
  
    //no need to call backend as it can do the required work in frontend itself!

      //this func removes the saved token
      await AsyncStorage.removeItem('token');

  
      Toast.show({ type: 'success', text1: 'Logged out successfully!' });

      //navigates to landing pg
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        })
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: error.message,
      });
    }
  };

  const [userdetails, setuserdetails] = useState(null);
  
 const fetchuserdetails = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No user found');
      return;
    }

    const res = await axios.get("http://192.168.232.209:3000/profile/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data) {
      setuserdetails(res.data); // stored user data in state, so that we can vary it as if we want
    }
  } catch (error) {
    console.error('Error fetching user info:', error.message);
  }
};



useEffect(() => {
  fetchuserdetails();
}, []);


const editdp=async()=>{
    
    const askpermission=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(askpermission.granted==false){
      Alert.alert("Permission to access gallery is required!");
      return;
    }

    const selectimg=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[1,1],
      quality:1,
    });
    if(!selectimg.canceled){
      const selectedimg=selectimg.assets[0].uri;
      setuserdetails((prev)=>({
        ...prev,
        avatar:selectedimg,
      }))
      const token=await AsyncStorage.getItem('token');
      await axios.patch("http://192.168.232.209:3000/profile/avatar",
       {avatar:selectedimg},
       {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      Toast.show({ type: 'success', text1: 'Profile picture updated' });
    }


  }

  

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userdetails?.avatar }} style={styles.avatar} />
{editMode && (
  <TouchableOpacity style={styles.avatarOverlay} onPress={editdp}>
    <Text style={styles.editIcon}>📷</Text>
  </TouchableOpacity>
)}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{userdetails?.fullname ?? 'Loading...'}</Text>
      </View>
      <View>
        <TouchableOpacity
        style={[styles.editButton, editMode && styles.editButtonActive]}
        onPress={onEditToggle}
      >
        <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
          {editMode ? 'Below🔻' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.logoutButton]}
        onPress={handlelogout}
      >
        <Text style={[styles.editButtonText]}>
          Logout
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileSummary;

const styles = StyleSheet.create({
container: {
  width:'100%',
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 20,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
  marginBottom: 16,
},
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#93c5fd',
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 22,
    color: '#fff',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b'  },
  username: {
    fontSize: 16,
    color: '#64748b',
    opacity: 0.8,
    marginTop: 4,
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    height:"30",
    marginTop:'10',
    alignItems:'center',
    textAlign:'center',
    textAlignVertical:'center',
    borderColor: 'rgba(0,255,255,0.3)',
    backgroundColor: 'rgba(0,255,255,0.1)',
  },
  editButtonActive: {
    backgroundColor: '#00ffff',
    borderColor: '#00ffff',
  },
  editButtonText: {
    color: '#000000ff',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 13,
  },
  editButtonTextActive: {
    color: '#000',
  },
  logoutButton:{
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    height:"28",
    marginTop:'10',
    alignItems:'center',
    textAlign:'center',
    textAlignVertical:'center',
    borderColor: 'rgba(255, 0, 0, 0.3)',
    backgroundColor: 'rgba(255, 0, 0, 0.17)',
  }
});
