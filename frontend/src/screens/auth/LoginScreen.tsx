import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { connect, connected, publicKey, signMessage } = useWallet();
  const { login } = useAuth();

  const handleConnectWallet = async () => {
    try {
      if (!connected) {
        await connect();
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de se connecter au wallet'
      });
    }
  };

  const handleLogin = async () => {
    if (!publicKey || !signMessage) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez d\'abord connecter votre wallet'
      });
      return;
    }

    try {
      setIsLoading(true);

      // Créer un message à signer
      const message = `FrensChain - Connexion\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`;
      const signature = await signMessage(new TextEncoder().encode(message));

      await login(
        publicKey.toString(),
        Array.from(signature).join(',')
      );

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Connexion réussie !'
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec de la connexion'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Connexion</Title>
            <Paragraph style={styles.subtitle}>
              Connectez votre wallet Phantom pour continuer
            </Paragraph>

            <View style={styles.walletInfo}>
              {connected && publicKey ? (
                <View style={styles.connectedWallet}>
                  <Paragraph style={styles.walletAddress}>
                    Wallet connecté: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                  </Paragraph>
                </View>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleConnectWallet}
                  style={styles.connectButton}
                  labelStyle={styles.buttonLabel}
                >
                  Connecter Phantom
                </Button>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={!connected || isLoading}
              style={styles.loginButton}
              labelStyle={styles.buttonLabel}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                'Se connecter'
              )}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Comment ça marche ?</Title>
            <Paragraph style={styles.infoText}>
              1. Connectez votre wallet Phantom{'\n'}
              2. Signez le message de connexion{'\n'}
              3. Accédez à votre profil et commencez à matcher !
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1e293b',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#64748b',
  },
  walletInfo: {
    marginBottom: 20,
  },
  connectedWallet: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  walletAddress: {
    textAlign: 'center',
    color: '#0369a1',
    fontWeight: 'bold',
  },
  connectButton: {
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#f1f5f9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  infoText: {
    color: '#475569',
    lineHeight: 24,
  },
});

export default LoginScreen;
