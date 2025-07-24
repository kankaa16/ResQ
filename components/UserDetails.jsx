import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import InfoCard from './InfoCard.jsx';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


import ProfileSummary from './ProfileSummary.jsx';
import { useNavigation } from '@react-navigation/native';

export default function UserDetails () {


  const navigation = useNavigation();
  const [user, setuser] = useState({
    avatar: 'https://via.placeholder.com/120',
    fullname: 'Loading...',
    gender: '-',
    dob: '-',
    bloodgrp: '-',
    phoneno: '-',
    alternatephone: '-',
    email: '-',
    address: '-',
    emergencycontacts: [],
    liveLocationSharing: false,
    lastlocation: '-',
    medicalconditions: '-',
    allergies: '-',
    medications: '-'
  });

  const labelToKey = {
  "Full Name": "fullname",
  "Gender": "gender",
  "Date of Birth": "dob",
  "Blood Group": "bloodgrp",
  "Phone Number": "phoneno",
  "Alternate Phone Number": "alternatephone",
  "Email": "email",
  "Last Location":"lastlocation",
  "Home Address": "address",
  "Medical Conditions": "medicalconditions",
  "Allergies": "allergies",
  "Medications": "medications"
};


  const [editMode, setEditMode] = useState(false);
  const toggleLocation = () => setuser(u => ({ ...u, liveLocationSharing: !u.liveLocationSharing }));


useEffect(() => {
  const fetchuser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get("http://192.168.232.209:3000/profile/user", {
        headers: {
          Authorization: `Bearer ${token}`
          
        }
      });

const u = res.data;
setuser({
  avatar: u.avatar || 'https://via.placeholder.com/120',
  fullname: u.fullname || '',
  gender: u.gender || '',
  dob: u.dob || '',
  bloodgrp: u.bloodgrp || '',
  phoneno: u.phoneno || '',
  alternatephone: u.alternatephone || '',
  email: u.email || '',
  address: u.address || '',
  emergencycontacts: Array.isArray(u.emergencycontacts) ? u.emergencycontacts : [],
  liveLocationSharing: u.liveLocationSharing ?? false,
  lastlocation: u.lastlocation || '',
  medicalconditions: u.medicalconditions || '',
  allergies: u.allergies || '',
  medications: u.medications || ''
});
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  };

  fetchuser();
}, []);


const savedetails = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.post("http://192.168.232.209:3000/profile/updateuserdetails", user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setuser(res.data); 
    setEditMode(false);
  } catch (err) {
    console.error("Failed to save details:", err.message);
  }
};

  const personal = [
    { label: 'Full Name', value: user?.fullname??'loading...' },
    { label: 'Gender', value: user.gender||"" },
    { label: 'Date of Birth', value: user.dob||"" },
    { label: 'Blood Group', value: user.bloodgrp||"" },
  ];
  const contactInfo = [
    { label: 'Phone Number', value: user.phoneno||"" },
    { label: 'Alternate Phone Number', value: user.alternatephone||"" },
    { label: 'Email', value: user.email||"" },
    { label: 'Home Address', value: user.address||"" }
  ];
  const health = [
    { label: 'Medical Conditions', value: user.medicalconditions||"" },
    { label: 'Allergies', value: user.allergies||"" },
    { label: 'Medications', value: user.medications||"" }
  ];

  const location=[
    {label:"Last Location", value:user.lastlocation||""}
  ];


  const handlefieldchange = (label, value) => {
  const key = labelToKey[label];
  if (key) {
    setuser((prevUser) => ({
      ...prevUser,
      [key]: value
    }));
  }
};

  


  return (
    <View style={s.vw}>
      <ScrollView contentContainerStyle={s.content}>
        <ProfileSummary
  avatar={user?.avatar}
  fullname={user?.fullname}
  editMode={editMode}
  setuserdetails={setuser}
  onEditToggle={() => setEditMode(!editMode)}

        />

        <View style={s.grid}>
<InfoCard
  title="Personal Information"
  icon="👤"
  fields={personal}
  editMode={editMode}
  style={s.fullCard}
  onfieldchange={handlefieldchange}
/>          

<InfoCard 
title="Contact Details" 
icon="📞" fields={contactInfo} 
editMode={editMode}
onfieldchange={handlefieldchange} 
/>

          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardHeading}>🚨 Emergency Configuration</Text>
            </View>
            {Array.isArray(user.emergencycontacts

            ) && user.emergencycontacts.map((c, i) => (
  <View key={i} style={s.emContact}>
    <View>
      <Text style={s.cName}>{c.name}</Text>
      <Text style={s.cRel}>{c.relation}</Text>
    </View>
    <Text style={s.cPhone}>{c.phone}</Text>
  </View>
))}
          </View>

  

          <InfoCard title='Location Settings' icon='📍' fields={location} editMode={editMode} onfieldchange={handlefieldchange}/>

          <InfoCard title="Health Details" icon="❤️" fields={health} editMode={editMode}
          onfieldchange={handlefieldchange} />
        </View>

        {/* Save / Cancel */}
        <View style={s.footer}>
          <TouchableOpacity style={s.buttonPrimary} onPress={savedetails}>
            <Text style={s.btnSecText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.buttonSecondary} onPress={() => navigation.navigate("Home")}>
            <Text style={s.btnSecText}>Back</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  vw: { flex: 1, backgroundColor: '#f8fafc' },

  content: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  grid: {
    width: '100%',
    alignItems: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  cardIcon: { fontSize: 20, marginRight: 8 },
  cardHeading: { fontSize: 18, color: '#1e293b', fontWeight: '600' },

  emContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },
  cName: { color: '#1e293b', fontWeight: '600' },
  cRel: { color: '#0ea5e9' }, // light blue
  cPhone: { color: '#64748b' },

  fieldLabel: { color: '#475569', marginTop: 8 },
  fieldValue: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    padding: 8,
    marginTop: 4,
    borderRadius: 8,
  },
  location: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#334155',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonPrimary: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    height:'40',
    marginRight:'15',
    marginTop: 20,
  },
  buttonSecondary: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    padding: 12,
    height:'40',
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: '#f8fafc',
  },
  btnPrimText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  btnSecText: {
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

