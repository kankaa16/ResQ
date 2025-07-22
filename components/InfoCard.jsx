import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
const InfoCard = ({ title, icon, fields=[], editMode, onfieldchange }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldGroup}>
<Text style={styles.label}>{String(field.label)}</Text>
            {editMode ? (
              field.type === 'textarea' ? (
                <TextInput
                  style={styles.input}
                  value={field.value}
                  multiline
                  numberOfLines={4}
                  placeholder={field.label}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => onfieldchange && onfieldchange(field.label, text)}
                />
              ) : field.type === 'select' ? (
                // Fallback for select input
                <TextInput
                  style={styles.input}
                  value={field.value}
                  placeholder={field.label}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => onfieldchange && onfieldchange(field.label, text)}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={field.value}
                  placeholder={field.label}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => onfieldchange && onfieldchange(field.label, text)}
                />
              )
            ) : (
<Text style={[styles.value, field.sensitive && styles.sensitiveValue]}>
  {field.sensitive ? '•••••••• 🔒' : String(field.value ?? '')}
</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vw: { flex: 1, backgroundColor: '#fefefe' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    marginTop:'15',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 10,
  },

  icon: {
    fontSize: 20,
    marginRight: 10,
    color: '#0ea5e9', // Soft blue instead of neon
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  label: {
    fontSize: 14,
    color: '#64748b',
  },

  value: {
    color: '#334155',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },

  content: {
    gap: 12,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    color: '#1e293b',
    fontSize: 16,
  },

  sensitiveValue: {
    backgroundColor: '#ffe4e6', // light red/pink
    color: '#b91c1c',
    fontWeight: '600',
    padding: 8,
    borderRadius: 8,
  },
});


export default InfoCard;
