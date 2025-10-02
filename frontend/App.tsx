import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🚀 FrensChain</Text>
          <Text style={styles.subtitle}>Application de Rencontre Solana</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.sectionTitle}>✨ Fonctionnalités</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔗</Text>
            <Text style={styles.featureText}>Paiements en SOL</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Chat chiffré temps réel</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Matching intelligent</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Gamification et badges</Text>
          </View>
        </View>

        <View style={styles.pricing}>
          <Text style={styles.sectionTitle}>💰 Tarifs</Text>
          
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Early Bird</Text>
            <Text style={styles.priceAmount}>0.1 SOL</Text>
            <Text style={styles.priceDescription}>2000 premiers utilisateurs</Text>
          </View>
          
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Regular</Text>
            <Text style={styles.priceAmount}>0.2 SOL</Text>
            <Text style={styles.priceDescription}>3000 utilisateurs suivants</Text>
          </View>
          
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Monthly</Text>
            <Text style={styles.priceAmount}>0.05 SOL/mois</Text>
            <Text style={styles.priceDescription}>Abonnement récurrent</Text>
          </View>
        </View>

        <View style={styles.api}>
          <Text style={styles.sectionTitle}>🔧 API Backend</Text>
          <Text style={styles.apiText}>Backend opérationnel sur :</Text>
          <Text style={styles.apiUrl}>http://localhost:3001</Text>
          
          <View style={styles.endpoints}>
            <Text style={styles.endpoint}>✅ Health: /api/health</Text>
            <Text style={styles.endpoint}>✅ Test: /api/test</Text>
            <Text style={styles.endpoint}>✅ Pricing: /api/pricing</Text>
            <Text style={styles.endpoint}>✅ WebSocket: Chat temps réel</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>🔗 Connecter Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>📱 Créer un Profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            FrensChain - Application de rencontre basée sur Solana
          </Text>
          <Text style={styles.footerText}>
            Backend: ✅ Actif | Frontend: ✅ Actif
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  features: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#1e293b',
  },
  pricing: {
    marginBottom: 30,
  },
  priceCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginVertical: 5,
  },
  priceDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  api: {
    marginBottom: 30,
  },
  apiText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
  },
  apiUrl: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 15,
  },
  endpoints: {
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 10,
  },
  endpoint: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 5,
  },
  actions: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#6366f1',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 5,
  },
});
