import { Router } from 'express';
import { paymentService } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Traiter un paiement
router.post('/process', async (req: AuthRequest, res) => {
  try {
    const { transactionHash, amount, paymentType } = req.body;
    const userId = req.user!.id;

    if (!transactionHash || !amount || !paymentType) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (!['initial', 'monthly'].includes(paymentType)) {
      return res.status(400).json({ error: 'Type de paiement invalide' });
    }

    const payment = await paymentService.processPayment(
      userId,
      transactionHash,
      amount,
      paymentType
    );

    res.json({
      success: true,
      payment,
      message: 'Paiement traité avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors du traitement du paiement:', error);
    res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
  }
});

// Obtenir l'historique des paiements
router.get('/history', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const payments = await paymentService.getPaymentHistory(userId);

    res.json(payments);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Vérifier le statut d'abonnement
router.get('/subscription-status', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const status = await paymentService.checkSubscriptionStatus(userId);

    res.json(status);
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut d\'abonnement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les prix d'abonnement
router.get('/pricing', async (req, res) => {
  try {
    const pricing = {
      earlyBird: {
        price: 0.1,
        currency: 'SOL',
        description: 'Abonnement initial (2000 premiers utilisateurs)',
        duration: '6 mois',
        features: [
          'Accès premium complet',
          'Chat illimité',
          'Profils étendus',
          'Badges exclusifs'
        ]
      },
      regular: {
        price: 0.2,
        currency: 'SOL',
        description: 'Abonnement initial (3000 utilisateurs suivants)',
        duration: '6 mois',
        features: [
          'Accès premium complet',
          'Chat illimité',
          'Profils étendus',
          'Badges exclusifs'
        ]
      },
      monthly: {
        price: 0.05,
        currency: 'SOL',
        description: 'Abonnement mensuel récurrent',
        duration: '1 mois',
        features: [
          'Accès premium complet',
          'Chat illimité',
          'Profils étendus',
          'Badges exclusifs'
        ]
      }
    };

    res.json(pricing);
  } catch (error) {
    logger.error('Erreur lors de la récupération des prix:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
