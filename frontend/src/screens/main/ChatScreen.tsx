import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Avatar, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

interface Match {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profileImage?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    isFromMe: boolean;
  };
  createdAt: string;
}

const ChatScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { matches: chatMatches, loadMatches } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    loadMatchesData();
  }, []);

  const loadMatchesData = async () => {
    try {
      setIsLoading(true);
      await loadMatches();
      setMatches(chatMatches);
    } catch (error) {
      console.error('Erreur lors du chargement des matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchPress = (match: Match) => {
    navigation.navigate('ChatDetail' as never, { match } as never);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Maintenant';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}j`;
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
              <Paragraph style={styles.timestamp}>
                {item.lastMessage ? formatTime(item.lastMessage.createdAt) : formatTime(item.createdAt)}
              </Paragraph>
            </View>
            
            <Paragraph style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage ? (
                item.lastMessage.isFromMe ? (
                  `Vous: ${item.lastMessage.content}`
                ) : (
                  item.lastMessage.content
                )
              ) : (
                'Nouveau match ! Commencez la conversation'
              )}
            </Paragraph>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Paragraph style={styles.loadingText}>Chargement des conversations...</Paragraph>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Title style={styles.emptyTitle}>Aucune conversation</Title>
        <Paragraph style={styles.emptyText}>
          Commencez à liker des profils pour créer des matches et des conversations !
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Messages</Title>
        <Paragraph style={styles.headerSubtitle}>
          {matches.length} conversation{matches.length > 1 ? 's' : ''}
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
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
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

export default ChatScreen;
