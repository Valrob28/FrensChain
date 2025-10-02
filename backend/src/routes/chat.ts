import { Router } from 'express';
import { chatService } from '../index';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Obtenir les messages d'un match
router.get('/messages/:matchId', async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!.id;
    const { page = 1, limit = 50 } = req.query;

    // Vérifier que l'utilisateur fait partie du match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        isActive: true
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé ou inactif' });
    }

    const messages = await chatService.getMessages(
      matchId,
      userId,
      Number(page),
      Number(limit)
    );

    res.json(messages);
  } catch (error) {
    logger.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Marquer les messages comme lus
router.post('/messages/:matchId/read', async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!.id;

    await chatService.markMessagesAsRead(matchId, userId);

    res.json({ success: true });
  } catch (error) {
    logger.error('Erreur lors du marquage des messages comme lus:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les statistiques de chat
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [totalMessages, activeMatches, unreadCount] = await Promise.all([
      prisma.message.count({
        where: { senderId: userId }
      }),
      prisma.match.count({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ],
          isActive: true
        }
      }),
      // Pour l'instant, on retourne 0 pour les messages non lus
      // Dans une implémentation complète, il faudrait un système de marquage des messages lus
      0
    ]);

    res.json({
      totalMessages,
      activeMatches,
      unreadCount
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques de chat:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
