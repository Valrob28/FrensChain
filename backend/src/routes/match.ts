import { Router } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Liker un utilisateur
router.post('/like', async (req: AuthRequest, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user!.id;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous liker vous-même' });
    }

    // Vérifier que l'utilisateur existe
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si le like existe déjà
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId,
        receiverId
      }
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Vous avez déjà liké cet utilisateur' });
    }

    // Créer le like
    const like = await prisma.like.create({
      data: {
        senderId,
        receiverId
      }
    });

    // Vérifier s'il y a un match (like mutuel)
    const mutualLike = await prisma.like.findFirst({
      where: {
        senderId: receiverId,
        receiverId: senderId
      }
    });

    let match = null;
    if (mutualLike) {
      // Créer un match
      match = await prisma.match.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId
        },
        include: {
          user1: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          },
          user2: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          }
        }
      });

      logger.info(`Nouveau match créé entre ${senderId} et ${receiverId}`);
    }

    res.json({
      like,
      match,
      isMatch: !!match
    });
  } catch (error) {
    logger.error('Erreur lors du like:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les matches
router.get('/matches', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        isActive: true
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    // Formater les matches pour inclure l'autre utilisateur
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      const lastMessage = match.messages[0];

      return {
        id: match.id,
        otherUser,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isFromMe: lastMessage.senderId === userId
        } : null,
        createdAt: match.createdAt
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    logger.error('Erreur lors de la récupération des matches:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les likes reçus
router.get('/likes-received', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const likes = await prisma.like.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            interests: {
              include: {
                interest: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    res.json(likes.map(like => ({
      id: like.id,
      sender: like.sender,
      createdAt: like.createdAt
    })));
  } catch (error) {
    logger.error('Erreur lors de la récupération des likes reçus:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les likes envoyés
router.get('/likes-sent', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const likes = await prisma.like.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            interests: {
              include: {
                interest: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    res.json(likes.map(like => ({
      id: like.id,
      receiver: like.receiver,
      createdAt: like.createdAt
    })));
  } catch (error) {
    logger.error('Erreur lors de la récupération des likes envoyés:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Supprimer un match
router.delete('/matches/:matchId', async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!.id;

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
      return res.status(404).json({ error: 'Match non trouvé' });
    }

    await prisma.match.update({
      where: { id: matchId },
      data: { isActive: false }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Erreur lors de la suppression du match:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
