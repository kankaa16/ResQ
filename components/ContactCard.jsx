import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const formatPhoneNumber = (phone) => {
    // Adjust formatting to match original logic
    return phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
  };

  return (
    <View style={[styles.card, contact.isPrimary && styles.primary]}>
      {/* Primary Badge */}
      {contact.isPrimary && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Primary Contact</Text>
        </View>
      )}

      {/* Edit/Delete Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={onEdit}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.name}>{contact.name}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.icon}>📞</Text>
            <Text style={styles.phone}>{formatPhoneNumber(contact.phone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.icon}>❤️</Text>
            <Text style={styles.relation}>{contact.relation}</Text>
          </View>
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.footer}>
        <Text style={styles.updatedText}>
          Updated: {new Date(contact.lastUpdated).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default ContactCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    color:"#000000ff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    position: 'relative'
  },
  primary: {
    borderColor: 'rgba(0,255,255,0.5)',
    backgroundColor: 'rgba(0,255,255,0.05)'
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00ffff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  actions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editBtn: {
    backgroundColor: 'rgba(0,123,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0,123,255,0.3)'
  },
  deleteBtn: {
    backgroundColor: 'rgba(255,59,48,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.3)'
  },
  actionIcon: {
    fontSize: 14
  },
  info: {
    paddingRight: 60,
    marginBottom: 20
  },
  header: {
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6
  },
  icon: {
    fontSize: 18,
    textShadowColor: 'rgba(0,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textShadowColor: 'rgba(0,255,255,0.3)',
    textShadowRadius: 10
  },
  phone: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Courier'
  },
  relation: {
    color: '#000',
    fontSize: 15
  },
  details: {
    flexDirection: 'column',
    gap: 8
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12
  },
  updatedText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)'
  }
});
