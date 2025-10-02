import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class ChatService {
  private io: SocketIOServer;
  private encryptionKey: string;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
  }

  private encryptMessage(content: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptMessage(encryptedContent: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async sendMessage(
    matchId: string,
    senderId: string,
    content: string,
    messageType: string = 'text'
  ) {
    try {
      // Vérifier que l'utilisateur fait partie du match
      const match = await prisma.match.findFirst({
        where: {
          id: matchId,
          OR: [
            { user1Id: senderId },
            { user2Id: senderId }
          ]
        }
      });

      if (!match) {
        throw new Error('Match non trouvé ou accès non autorisé');
      }

      // Chiffrer le message
      const encryptedContent = this.encryptMessage(content);

      // Sauvegarder le message
      const message = await prisma.message.create({
        data: {
          matchId,
          senderId,
          content: encryptedContent,
          messageType,
          isEncrypted: true
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          }
        }
      });

      // Déchiffrer pour l'envoi (les clients recevront le message chiffré)
      const messageForClient = {
        ...message,
        content: this.decryptMessage(message.content)
      };

      return messageForClient;
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  async getMessages(matchId: string, userId: string, page: number = 1, limit: number = 50) {
    try {
      // Vérifier que l'utilisateur fait partie du match
      const match = await prisma.match.findFirst({
        where: {
          id: matchId,
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        }
      });

      if (!match) {
        throw new Error('Match non trouvé ou accès non autorisé');
      }

      const messages = await prisma.message.findMany({
        where: { matchId },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      });

      // Déchiffrer les messages
      const decryptedMessages = messages.map(message => ({
        ...message,
        content: this.decryptMessage(message.content)
      }));

      return decryptedMessages.reverse();
    } catch (error) {
      logger.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  }

  async markMessagesAsRead(matchId: string, userId: string) {
    try {
      // Implémenter la logique pour marquer les messages comme lus
      // Pour l'instant, on retourne simplement un succès
      return { success: true };
    } catch (error) {
      logger.error('Erreur lors du marquage des messages comme lus:', error);
      throw error;
    }
  }
}
