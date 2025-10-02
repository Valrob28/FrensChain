import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ActivityIndicator, List } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Toast from 'react-native-toast-message';

interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  description: string;
  duration: string;
  features: string[];
}

const PremiumScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const { user } = useAuth();

  React.useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const response = await api.get('/payment/pricing');
      setPricing([
        {
          name: 'Early Bird',
          price: response.data.earlyBird.price,
          currency: response.data.earlyBird.currency,
          description: response.data.earlyBird.description,
          duration: response.data.earlyBird.duration,
          features: response.data.earlyBird.features
        },
        {
          name: 'Regular',
          price: response.data.regular.price,
          currency: response.data.regular.currency,
          description: response.data.regular.description,
          duration: response.data.regular.duration,
          features: response.data.regular.features
        },
        {
          name: 'Monthly',
          price: response.data.monthly.price,
          currency: response.data.monthly.currency,
          description: response.data.monthly.description,
          duration: response.data.monthly.duration,
          features: response.data.monthly.features
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des prix:', error);
    }
  };

  const handleSubscribe = async (planType: string) => {
    try {
      setIsLoading(true);
      
      // Simuler une transaction Solana
      const mockTransactionHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const amount = pricing.find(p => p.name.toLowerCase().includes(planType.toLowerCase()))?.price || 0;
      
      await api.post('/payment/process', {
        transactionHash: mockTransactionHash,
        amount,
        paymentType: planType === 'monthly' ? 'monthly' : 'initial'
      });

      Toast.show({
        type: 'success',
        text1: 'Abonnement activé !',
        text2: 'Votre abonnement premium a été activé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de traiter l\'abonnement'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPricingCard = (plan: PricingPlan, index: number) => (
    <Card key={index} style={[
      styles.pricingCard,
      plan.name === 'Early Bird' && styles.featuredCard
    ]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.planName}>{plan.name}</Title>
          {plan.name === 'Early Bird' && (
            <Chip mode="outlined" style={styles.featuredChip}>
              Recommandé
            </Chip>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Title style={styles.price}>{plan.price} {plan.currency}</Title>
          <Paragraph style={styles.duration}>/ {plan.duration}</Paragraph>
        </View>
        
        <Paragraph style={styles.description}>{plan.description}</Paragraph>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, featureIndex) => (
            <View key={featureIndex} style={styles.featureItem}>
              <Paragraph style={styles.featureText}>✓ {feature}</Paragraph>
            </View>
          ))}
        </View>
        
        <Button
          mode={plan.name === 'Early Bird' ? 'contained' : 'outlined'}
          onPress={() => handleSubscribe(plan.name.toLowerCase())}
          style={[
            styles.subscribeButton,
            plan.name === 'Early Bird' && styles.featuredButton
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            `S'abonner - ${plan.price} ${plan.currency}`
          )}
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>FrensChain Premium</Title>
        <Paragraph style={styles.headerSubtitle}>
          Débloquez toutes les fonctionnalités premium
        </Paragraph>
      </View>

      <Card style={styles.benefitsCard}>
        <Card.Content>
          <Title style={styles.benefitsTitle}>Avantages Premium</Title>
          <List.Item
            title="Chat illimité"
            description="Communiquez sans limite avec vos matches"
            left={props => <List.Icon {...props} icon="chat" />}
          />
          <List.Item
            title="Profils étendus"
            description="Plus d'informations sur vos intérêts et passions"
            left={props => <List.Icon {...props} icon="account-details" />}
          />
          <List.Item
            title="Badges exclusifs"
            description="Montrez votre statut premium avec des badges spéciaux"
            left={props => <List.Icon {...props} icon="medal" />}
          />
          <List.Item
            title="Support prioritaire"
            description="Aide et support en priorité"
            left={props => <List.Icon {...props} icon="headset" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.pricingContainer}>
        <Title style={styles.pricingTitle}>Choisissez votre plan</Title>
        {pricing.map((plan, index) => renderPricingCard(plan, index))}
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>Comment ça marche ?</Title>
          <Paragraph style={styles.infoText}>
            1. Choisissez votre plan d'abonnement{'\n'}
            2. Effectuez le paiement en SOL via votre wallet{'\n'}
            3. Votre abonnement est activé automatiquement{'\n'}
            4. Profitez de toutes les fonctionnalités premium !
          </Paragraph>
        </Card.Content>
      </Card>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  benefitsCard: {
    margin: 20,
    backgroundColor: '#ffffff',
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  pricingContainer: {
    padding: 20,
  },
  pricingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  pricingCard: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  featuredChip: {
    backgroundColor: '#6366f1',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  duration: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 5,
  },
  description: {
    color: '#64748b',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    color: '#475569',
    fontSize: 14,
  },
  subscribeButton: {
    borderRadius: 8,
  },
  featuredButton: {
    backgroundColor: '#6366f1',
  },
  infoCard: {
    margin: 20,
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

export default PremiumScreen;
