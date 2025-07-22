import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import ContactCard from './ContactCard.jsx';
import ContactForm from './ContactForm.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    {
      id:Date.now(),
      name: "Loading...",
      phone:"",
      relation:"",
      isPrimary:false,
    }
  ]);



  useEffect(()=>{
    
    const fetchuser=async()=>{
      try{
        const token=await AsyncStorage.getItem('token');
        const res=await axios.get("http://192.168.232.209:3000/profile/user",{
  
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        const u=res.data;
        setContacts(Array.isArray(u.emergencycontacts) ? u.emergencycontacts : [])
      }
      catch(err){
      console.error("Failed to fetch user contacts: ", err.message);
      }
    }
    fetchuser();
    },[]);

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const maxContacts = 5;

  const handleAddContact = (data) => {
    if (contacts.length >= maxContacts) {
      Alert.alert('Limit reached', `Maximum ${maxContacts} contacts allowed`);
      return;
    }
    setContacts([
      ...contacts,
      { ...data, id: Date.now() },
    ]);
    setShowForm(false);
  };

  const handleEditContact = (data) => {
    setContacts(
      contacts.map((c) =>
        c.id === editingContact.id ? { ...c, ...data} : c
      )
    );
    setEditingContact(null);
    setShowForm(false);
  };

  const handledeletecontactcard=(id)=>{
    Alert.alert("Confirm delete?","Are you sure?",[
      {text:'Cancel', style:"cancel"},
      {text:'Delete', style:"destructive",
      onPress:()=>handledelete(id),}
    ]);
  };

  const handledelete=async(id)=>{
    try{
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.232.209:3000/profile/deletecontact/${id}`,
      {
        headers: {
        Authorization: `Bearer ${token}`, 
      },
  });
  setContacts((prev)=>prev.filter((c)=>(c.id!==id)));
}
catch(error){
  Alert.alert('Error', 'Could not delete the contact.');
}}

  const openEditForm = (c) => {
    setEditingContact(c);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingContact(null);
    setShowForm(false);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)} style={styles.tooltipIcon}>
              <Text style={{ color: '#fff' }}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>
            People who will be alerted when you press the SOS button.
          </Text>
          {showTooltip && (
            <View style={styles.tooltipPopup}>
              <Text style={styles.tooltipText}>
                These contacts will be automatically alerted when you press the SOS button.
                They'll receive your location and emergency message.
              </Text>
            </View>
          )}
        </View>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <ContactCard
              key={ c.id}
              contact={c}
              onEdit={() => openEditForm(c)}
              onDelete={() => handledeletecontactcard( c.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📞</Text>
            <Text style={styles.emptyText}>No Emergency Contacts</Text>
            <Text style={styles.emptyText}>Add your first emergency contact to get started.</Text>
          </View>
        )}

        {/* Add Button */}
        <View style={styles.addSection}>
          <TouchableOpacity
            style={[styles.addButton, contacts.length >= maxContacts && styles.disabledButton]}
            disabled={contacts.length >= maxContacts}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add Emergency Contact</Text>
          </TouchableOpacity>
          {contacts.length >= maxContacts && (
            <Text style={styles.limitWarning}>
              <Text> ⚠️ </Text>Maximum {maxContacts} emergency contacts reached
</Text>

          )}
          <Text style={styles.contactCount}>
            {contacts.length} of {maxContacts} contacts added
          </Text>
        </View>

        {/* Last Updated */}
        {contacts.length > 0 && (
          <Text style={styles.lastUpdatedText}>
            Last updated on {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        )}
      </ScrollView>

      {/* contact form */}
      <Modal visible={showForm} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeForm} />
        <View style={styles.modalContent}>
          <ContactForm
            details={contacts}
            contact={editingContact}
            existingContacts={contacts}
            onSubmit={editingContact ? handleEditContact : handleAddContact}
            onCancel={closeForm}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' }, // soft light bg
  content: { padding: 20, paddingTop: 40, gap: 20 },

  headerSection: { marginBottom: 20, alignItems: 'center' },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0ea5e9', // soft blue
    backgroundColor: 'transparent',
  },

  tooltipIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionSubtitle: {
    color: '#475569', // slate gray
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 600,
  },

  tooltipPopup: {
    marginTop: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },

  tooltipText: {
    color: '#334155',
    fontSize: 12,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: '#000000ff',
  },

  emptyText: {
    color: '#000000ff',
    fontSize: 18,
    textAlign: 'center',
  },

  addSection: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#bae6fd', // pastel cyan
    borderRadius: 12,
  },

  disabledButton: {
    backgroundColor: '#e2e8f0', // light grayish blue
  },

  addIcon: {
    fontSize: 20,
    color: '#1e293b', // deep blue-gray
  },

  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  limitWarning: {
    color: '#dc2626', // soft red
    fontSize: 14,
    marginTop: 8,
  },

  contactCount: {
    color: '#000000ff',
    fontSize: 14,
  },

  lastUpdatedText: {
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
    marginVertical: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 0,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
