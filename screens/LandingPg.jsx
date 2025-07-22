// Landpg.js (React Native)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const Landpg = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>
          <Text style={styles.logoHighlight}>ResQ</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Stay <Text style={styles.neonPink}>Safe</Text>
            {'\n'}Stay <Text style={styles.neonPurple}>Connected</Text>
          </Text>
        <Text style={styles.heroDescription}>
  You’re never alone. ResQ is with you—every step, every second.{'\n'}
  <Text style={styles.neonCyan}>Your safety is our priority.</Text>
  </Text>


          <TouchableOpacity
            onPress={() => navigation.navigate('Auth')}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.secondaryCta}>
            Download now • Available on iOS & Android
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.pink]}>
              <Feather name="map-pin" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Live Location</Text>
            <Text style={styles.featureDescription}>
              Instantly share your real-time location with trusted contacts.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.purple]}>
              <MaterialIcons name="groups" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Trusted Network</Text>
            <Text style={styles.featureDescription}>
              Build your safety network with family and friends.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.blue]}>
              <Ionicons name="alert-circle" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Emergency Alert</Text>
            <Text style={styles.featureDescription}>
              One-tap emergency alerts to your safety network.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Landpg;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc', // soft sky blue-white
  },
  scroll: {
    paddingBottom: 40,
  },
  navbar: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#264653',
  },
  logoHighlight: {
    color: '#f06292', // soft pink
    textShadowColor: '#f8bbd0',
    textShadowRadius: 6,
  },
  hero: {
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d3142',
    lineHeight: 40,
    marginBottom: 20,
  },
  neonPink: {
    color: '#f06292', // pastel pink
    textShadowColor: 'rgba(240, 98, 146, 0.4)',
    textShadowRadius: 6,
  },
  neonPurple: {
    color: '#b39ddb', // lavender
    textShadowColor: 'rgba(179, 157, 219, 0.4)',
    textShadowRadius: 6,
  },
  neonCyan: {
    color: '#64d3de', // soft mint cyan
    marginTop: 10,
  },
  heroDescription: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#64d3de', // soft mint blue
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: '#64d3de',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryCta: {
    marginTop: 16,
    fontSize: 12,
    color: '#6b7280',
  },
  features: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pink: {
    backgroundColor: '#f48fb1', // soft pink
  },
  purple: {
    backgroundColor: '#b39ddb', // lavender
  },
  blue: {
    backgroundColor: '#64d3de', // minty cyan
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3142',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#555',
    textAlign: 'center',
  },
});
