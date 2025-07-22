import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactForm = ({ contact, onSubmit, onCancel, existingContacts,details }) => {
  const [formData, setFormData] = useState({
    id:Date.now(),
    name: '',
    phone: '',
    relation: '',
    isPrimary: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relationOptions = [
    'Parent', 'Guardian', 'Spouse', 'Sibling', 'Child',
    'Friend', 'Colleague', 'Neighbor', 'Doctor', 'Other'
  ];

  useEffect(() => {
    if (contact) {
      setFormData({
        id:contact.id||'',
        name: contact.name || '',
        phone: contact.phone || '',
        relation: contact.relation || '',
        isPrimary: contact.isPrimary || false
      });
    }
  }, [contact]);

const savedetails = async () => {
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    const token = await AsyncStorage.getItem('token');
    const updatedContact = {
      ...formData,
      id: contact ? contact.id : Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    const updatedContacts = contact
      ? existingContacts.map((c) => (c.id === contact.id ? updatedContact : c))
      : [...existingContacts, updatedContact];


   await axios.post(
  "http://192.168.232.209:3000/profile/emergencycontacts",
  { emergencycontacts: updatedContacts },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
onSubmit(updatedContact);
  } catch (err) {
    console.error("Failed to save contact:", err.message);
    Alert.alert("Error", "Could not save contact.");
  }

  setIsSubmitting(false);
};

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number';

    const isDuplicate = existingContacts.some(
      c => c.phone === formData.phone && (!contact || c.id !== contact.id)
    );
    if (isDuplicate) newErrors.phone = 'This phone number is already added';

    if (!formData.relation.trim()) newErrors.relation = 'Relation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{contact ? 'Edit Contact' : 'Add Emergency Contact'}</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View style={styles.group}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          value={formData.name}
          onChangeText={(val) => handleInputChange('name', val)}
          style={[styles.input, errors.name && styles.errorInput]}
          placeholder="Enter full name"
          placeholderTextColor="#aaa"
        />
        {errors.name && <Text style={styles.errorText}>⚠️ {errors.name}</Text>}
      </View>

      {/* Phone */}
      <View style={styles.group}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          value={formData.phone}
          onChangeText={(val) => handleInputChange('phone', val)}
          style={[styles.input, errors.phone && styles.errorInput]}
          placeholder="+1 (555) 123-4567"
          keyboardType="phone-pad"
          placeholderTextColor="#aaa"
        />
        {errors.phone && <Text style={styles.errorText}>⚠️ {errors.phone}</Text>}
      </View>

      {/* Relation Picker */}
      <View style={styles.group}>
        <Text style={styles.label}>Relation *</Text>
        <View style={[styles.pickerWrapper, errors.relation && styles.errorInput]}>
          <Picker
            selectedValue={formData.relation}
            onValueChange={(val) => handleInputChange('relation', val)}
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            <Picker.Item label="Select relation" value="" />
            {relationOptions.map((opt) => (
              <Picker.Item label={opt} value={opt} key={opt} />
            ))}
          </Picker>
        </View>
        {errors.relation && <Text style={styles.errorText}>⚠️ {errors.relation}</Text>}
      </View>

      {/* Primary Checkbox */}
      <View style={styles.group}>
        <View style={styles.switchRow}>
          <Switch
            value={formData.isPrimary}
            onValueChange={(val) => handleInputChange('isPrimary', val)}
            trackColor={{ false: '#444', true: '#00ffff' }}
            thumbColor={formData.isPrimary ? '#0080ff' : '#ccc'}
          />
          <Text style={styles.switchLabel}>Set as Primary Contact</Text>
        </View>
        <Text style={styles.switchHelp}>Primary contact will be called first during emergencies</Text>
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={isSubmitting}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={savedetails} disabled={isSubmitting}>
          <Text style={styles.submitText}>
            {isSubmitting ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ContactForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(26,26,46,0.95)',
    padding: 20,
    borderRadius: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00ffff',
    textShadowColor: 'rgba(0,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  closeBtn: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    fontSize: 20,
    color: '#fff'
  },
  group: {
    marginBottom: 16
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  picker: {
    color: '#fff'
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 4,
    fontSize: 12
  },
  errorInput: {
    borderColor: '#ff3b30'
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16
  },
  switchHelp: {
    color: '#999',
    fontSize: 13,
    marginTop: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center'
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#00ffff',
    alignItems: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  submitText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16
  }
});
