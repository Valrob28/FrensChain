import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  username: string;
  profileImage?: string;
  interests: Array<{ name: string }>;
  isPremium: boolean;
}

const DiscoverScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/user/discover');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les profils'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (userId: string) => {
    try {
      const response = await api.post('/match/like', { receiverId: userId });
      
      if (response.data.isMatch) {
        Toast.show({
          type: 'success',
          text1: 'Match ! 🎉',
          text2: 'Vous avez un nouveau match !'
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Like envoyé',
          text2: 'En attente d\'un match...'
        });
      }

      // Passer au profil suivant
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors du like:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible d\'envoyer le like'
      });
    }
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: item.profileImage || 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Photo'
          }}
          style={styles.profileImage}
        />
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Chip mode="outlined" compact style={styles.premiumChip}>
              Premium
            </Chip>
          </View>
        )}
      </View>
      
      <Card.Content style={styles.cardContent}>
        <Title style={styles.username}>{item.username}</Title>
        
        <View style={styles.interestsContainer}>
          {item.interests.map((interest, index) => (
            <Chip key={index} style={styles.interestChip} compact>
              {interest.name}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Paragraph style={styles.loadingText}>Chargement des profils...</Paragraph>
      </View>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <View style={styles.emptyContainer}>
        <Title style={styles.emptyTitle}>Plus de profils</Title>
        <Paragraph style={styles.emptyText}>
          Vous avez vu tous les profils disponibles. Revenez plus tard !
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => {
            setCurrentIndex(0);
            loadUsers();
          }}
          style={styles.refreshButton}
        >
          Actualiser
        </Button>
      </View>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Découvrir</Title>
        <Paragraph style={styles.headerSubtitle}>
          {currentIndex + 1} / {users.length}
        </Paragraph>
      </View>

      <View style={styles.cardContainer}>
        {renderUserCard({ item: currentUser })}
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handlePass}
          style={[styles.actionButton, styles.passButton]}
          labelStyle={styles.passButtonLabel}
        >
          Passer
        </Button>
        
        <Button
          mode="contained"
          onPress={() => handleLike(currentUser.id)}
          style={[styles.actionButton, styles.likeButton]}
          labelStyle={styles.likeButtonLabel}
        >
          Like ❤️
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    color: '#64748b',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    flex: 1,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  premiumChip: {
    backgroundColor: '#fbbf24',
  },
  cardContent: {
    padding: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#e0e7ff',
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
  },
  passButton: {
    borderColor: '#64748b',
  },
  passButtonLabel: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  likeButton: {
    backgroundColor: '#ec4899',
  },
  likeButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#64748b',
    lineHeight: 24,
  },
  refreshButton: {
    paddingHorizontal: 20,
  },
});

export default DiscoverScreen;
