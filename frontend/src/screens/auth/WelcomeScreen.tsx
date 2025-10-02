import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/120x120/6366f1/ffffff?text=FC' }}
          style={styles.logo}
        />
        
        <Title style={styles.title}>FrensChain</Title>
        <Paragraph style={styles.subtitle}>
          L'application de rencontre basée sur Solana
        </Paragraph>

        <Card style={styles.featuresCard}>
          <Card.Content>
            <Title style={styles.featuresTitle}>Fonctionnalités</Title>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>🔗 Paiements en SOL</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>💬 Chat chiffré</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>🎯 Matching intelligent</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>🏆 Gamification</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Se connecter
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Register' as never)}
            style={[styles.button, styles.outlineButton]}
            labelStyle={[styles.buttonLabel, styles.outlineButtonLabel]}
          >
            Créer un compte
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresCard: {
    width: '100%',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#475569',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 15,
    paddingVertical: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButtonLabel: {
    color: '#ffffff',
  },
});

export default WelcomeScreen;
