import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { logger } from '../utils/logger';

export class SolanaService {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    this.programId = new PublicKey(process.env.PROGRAM_ID!);
  }

  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: 'confirmed'
      });

      if (!transaction) {
        return false;
      }

      // Vérifier que la transaction est confirmée
      if (transaction.meta?.err) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Erreur lors de la vérification de la transaction:', error);
      return false;
    }
  }

  async getAccountBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey));
      return balance / 1e9; // Convertir en SOL
    } catch (error) {
      logger.error('Erreur lors de la récupération du solde:', error);
      return 0;
    }
  }

  async createSubscriptionInstruction(
    userPublicKey: PublicKey,
    subscriptionType: 'early_bird' | 'regular' | 'monthly'
  ): Promise<TransactionInstruction> {
    // Cette fonction créerait l'instruction pour le smart contract
    // Pour l'instant, on retourne une instruction vide
    return new TransactionInstruction({
      keys: [],
      programId: this.programId,
      data: Buffer.alloc(0)
    });
  }

  async listenForPayments(callback: (signature: string, amount: number, userAddress: string) => void) {
    // Écouter les transactions sur le programme
    this.connection.onProgramAccountChange(
      this.programId,
      async (accountInfo, context) => {
        try {
          // Analyser les changements de compte pour détecter les paiements
          logger.info('Changement détecté sur le programme:', accountInfo);
        } catch (error) {
          logger.error('Erreur lors de l\'écoute des paiements:', error);
        }
      },
      'confirmed'
    );
  }
}
