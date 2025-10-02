import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Avatar, Badge, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Toast from 'react-native-toast-message';

interface Match {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profileImage?: string;
    interests: Array<{ name: string }>;
  };
  createdAt: string;
}

const MatchesScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/match/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matches:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les matches'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchPress = (match: Match) => {
    navigation.navigate('ChatDetail' as never, { match } as never);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const renderMatchItem = ({ item }: { item: Match }) => (
    <TouchableOpacity onPress={() => handleMatchPress(item)}>
      <Card style={styles.matchCard}>
        <View style={styles.matchContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={60}
              source={{ 
                uri: item.otherUser.profileImage || 'https://via.placeholder.com/60x60/6366f1/ffffff?text=Avatar'
              }}
            />
            <Badge visible={true} style={styles.onlineBadge} />
          </View>
          
          <View style={styles.matchInfo}>
            <View style={styles.matchHeader}>
              <Title style={styles.username}>{item.otherUser.username}</Title>
              <Paragraph style={styles.date}>
                {formatDate(item.createdAt)}
              </Paragraph>
            </View>
            
            <View style={styles.interestsContainer}>
              {item.otherUser.interests.slice(0, 3).map((interest, index) => (
                <Chip key={index} style={styles.interestChip} compact>
                  {interest.name}
                </Chip>
              ))}
              {item.otherUser.interests.length > 3 && (
                <Chip style={styles.moreChip} compact>
                  +{item.otherUser.interests.length - 3}
                </Chip>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Paragraph style={styles.loadingText}>Chargement des matches...</Paragraph>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Title style={styles.emptyTitle}>Aucun match</Title>
        <Paragraph style={styles.emptyText}>
          Commencez à liker des profils pour créer des matches !
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Mes Matches</Title>
        <Paragraph style={styles.headerSubtitle}>
          {matches.length} match{matches.length > 1 ? 'es' : ''}
        </Paragraph>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderMatchItem}
        style={styles.matchesList}
        showsVerticalScrollIndicator={false}
      />
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
    color: '#64748b',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    color: '#64748b',
    marginTop: 5,
  },
  matchesList: {
    flex: 1,
  },
  matchCard: {
    margin: 10,
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 16,
    height: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: '#e0e7ff',
    marginRight: 5,
    marginBottom: 5,
  },
  moreChip: {
    backgroundColor: '#f1f5f9',
    marginRight: 5,
    marginBottom: 5,
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
    color: '#64748b',
    lineHeight: 24,
  },
});

export default MatchesScreen;
