import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

const INTERESTS = [
  'Amis', 'Amour', 'Sexe', 'Crypto', 'Passion', 'Sport', 'Musique', 'Voyage'
];

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { connected, publicKey, signMessage } = useWallet();
  const { register } = useAuth();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Nom d\'utilisateur requis'
      });
      return;
    }

    if (selectedInterests.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Sélectionnez au moins un intérêt'
      });
      return;
    }

    if (!connected || !publicKey || !signMessage) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez d\'abord connecter votre wallet'
      });
      return;
    }

    try {
      setIsLoading(true);
      await register(username.trim(), selectedInterests);
      
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Profil créé avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec de la création du profil'
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
            <Title style={styles.title}>Créer un profil</Title>
            <Paragraph style={styles.subtitle}>
              Remplissez les informations pour créer votre profil
            </Paragraph>

            <TextInput
              label="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              placeholder="Choisissez un nom d'utilisateur unique"
            />

            <Paragraph style={styles.interestsTitle}>Vos intérêts</Paragraph>
            <View style={styles.interestsContainer}>
              {INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() => handleInterestToggle(interest)}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.selectedChip
                  ]}
                >
                  {interest}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              disabled={!connected || isLoading || !username.trim() || selectedInterests.length === 0}
              style={styles.registerButton}
              labelStyle={styles.buttonLabel}
            >
              {isLoading ? 'Création...' : 'Créer mon profil'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Pourquoi créer un profil ?</Title>
            <Paragraph style={styles.infoText}>
              • Trouvez des personnes partageant vos intérêts{'\n'}
              • Créez des connexions authentiques{'\n'}
              • Profitez d'une expérience personnalisée{'\n'}
              • Accédez aux fonctionnalités premium
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
  input: {
    marginBottom: 20,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  interestChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
  },
  selectedChip: {
    backgroundColor: '#6366f1',
  },
  registerButton: {
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

export default RegisterScreen;
