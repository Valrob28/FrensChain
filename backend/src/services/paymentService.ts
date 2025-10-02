import { prisma } from '../index';
import { solanaService } from '../index';
import { logger } from '../utils/logger';

export class PaymentService {
  async processPayment(
    userId: string,
    transactionHash: string,
    amount: number,
    paymentType: 'initial' | 'monthly'
  ) {
    try {
      // Vérifier que la transaction existe sur Solana
      const isValidTransaction = await solanaService.verifyTransaction(transactionHash);
      
      if (!isValidTransaction) {
        throw new Error('Transaction invalide ou non confirmée');
      }

      // Créer l'enregistrement de paiement
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          transactionHash,
          paymentType,
          status: 'confirmed',
          confirmedAt: new Date()
        }
      });

      // Mettre à jour le statut premium de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      let premiumUntil: Date;
      const now = new Date();

      if (paymentType === 'initial') {
        // 6 mois pour l'abonnement initial
        premiumUntil = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
      } else {
        // 1 mois pour l'abonnement mensuel
        if (user.premiumUntil && user.premiumUntil > now) {
          // Ajouter 1 mois à la date existante
          premiumUntil = new Date(user.premiumUntil.getTime() + (30 * 24 * 60 * 60 * 1000));
        } else {
          // Commencer maintenant + 1 mois
          premiumUntil = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
        }
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          premiumUntil
        }
      });

      logger.info(`Paiement traité avec succès pour l'utilisateur ${userId}: ${amount} SOL`);

      return payment;
    } catch (error) {
      logger.error('Erreur lors du traitement du paiement:', error);
      throw error;
    }
  }

  async getPaymentHistory(userId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return payments;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isPremium: true,
          premiumUntil: true
        }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const now = new Date();
      const isActive = user.isPremium && user.premiumUntil && user.premiumUntil > now;

      return {
        isPremium: isActive,
        premiumUntil: user.premiumUntil,
        daysRemaining: user.premiumUntil 
          ? Math.ceil((user.premiumUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0
      };
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut d\'abonnement:', error);
      throw error;
    }
  }
}
