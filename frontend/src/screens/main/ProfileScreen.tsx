import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Avatar, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Toast from 'react-native-toast-message';

const ProfileScreen: React.FC = () => {
  const [stats, setStats] = useState({
    likesSent: 0,
    likesReceived: 0,
    matches: 0,
    messages: 0
  });
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, badgesResponse] = await Promise.all([
        api.get('/user/stats'),
        api.get('/gamification/badges')
      ]);
      
      setStats(statsResponse.data);
      setBadges(badgesResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données du profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Déconnexion',
        text2: 'Vous avez été déconnecté avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handlePremiumPress = () => {
    navigation.navigate('Premium' as never);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Avatar.Image
            size={80}
            source={{ 
              uri: user?.profileImage || 'https://via.placeholder.com/80x80/6366f1/ffffff?text=Avatar'
            }}
          />
          <View style={styles.userInfo}>
            <Title style={styles.username}>{user?.username}</Title>
            <Paragraph style={styles.walletAddress}>
              {user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-8)}
            </Paragraph>
            {user?.isPremium && (
              <Chip mode="outlined" style={styles.premiumChip}>
                Premium
              </Chip>
            )}
          </View>
        </View>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.statsTitle}>Statistiques</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.likesSent}</Paragraph>
              <Paragraph style={styles.statLabel}>Likes envoyés</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.likesReceived}</Paragraph>
              <Paragraph style={styles.statLabel}>Likes reçus</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.matches}</Paragraph>
              <Paragraph style={styles.statLabel}>Matches</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.messages}</Paragraph>
              <Paragraph style={styles.statLabel}>Messages</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.interestsCard}>
        <Card.Content>
          <Title style={styles.interestsTitle}>Mes intérêts</Title>
          <View style={styles.interestsContainer}>
            {user?.interests?.map((interest, index) => (
              <Chip key={index} style={styles.interestChip}>
                {interest.name}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {badges.length > 0 && (
        <Card style={styles.badgesCard}>
          <Card.Content>
            <Title style={styles.badgesTitle}>Mes badges</Title>
            {badges.map((userBadge, index) => (
              <List.Item
                key={index}
                title={userBadge.badge.name}
                description={userBadge.badge.description}
                left={props => <List.Icon {...props} icon="medal" />}
                right={() => (
                  <Chip mode="outlined" compact>
                    {userBadge.badge.rarity}
                  </Chip>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.actionsTitle}>Actions</Title>
          
          <Button
            mode="contained"
            onPress={handlePremiumPress}
            style={styles.actionButton}
            icon="crown"
          >
            {user?.isPremium ? 'Gérer l\'abonnement' : 'Passer Premium'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {/* Éditer le profil */}}
            style={styles.actionButton}
            icon="account-edit"
          >
            Modifier le profil
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {/* Paramètres */}}
            style={styles.actionButton}
            icon="cog"
          >
            Paramètres
          </Button>
          
          <Divider style={styles.divider} />
          
          <Button
            mode="text"
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
            icon="logout"
            textColor="#ef4444"
          >
            Se déconnecter
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Paragraph style={styles.footerText}>
          Membre depuis le {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
        </Paragraph>
        <Paragraph style={styles.footerText}>
          FrensChain v1.0.0
        </Paragraph>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  walletAddress: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 5,
  },
  premiumChip: {
    backgroundColor: '#fbbf24',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  statsCard: {
    margin: 20,
    backgroundColor: '#ffffff',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  interestsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: '#e0e7ff',
    marginRight: 8,
    marginBottom: 8,
  },
  badgesCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  actionsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  actionButton: {
    marginBottom: 10,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  divider: {
    marginVertical: 15,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default ProfileScreen;
