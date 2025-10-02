import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Connexion avec wallet
router.post('/login', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Adresse wallet et signature requis' });
    }

    // Vérifier la signature (simplifié pour l'exemple)
    // En production, il faudrait vérifier la signature avec le message signé

    let user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé. Veuillez créer un profil.' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        isPremium: user.isPremium,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer un profil utilisateur
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, username, interests, signature } = req.body;

    if (!walletAddress || !username || !interests || !signature) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier que l'utilisateur n'existe pas déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { walletAddress },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    // Créer les intérêts s'ils n'existent pas
    const interestRecords = await Promise.all(
      interests.map(async (interestName: string) => {
        return prisma.interest.upsert({
          where: { name: interestName },
          update: {},
          create: { name: interestName }
        });
      })
    );

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        walletAddress,
        username,
        interests: {
          create: interestRecords.map(interest => ({
            interestId: interest.id
          }))
        }
      },
      include: {
        interests: {
          include: {
            interest: true
          }
        }
      }
    });

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        isPremium: user.isPremium,
        profileImage: user.profileImage,
        interests: user.interests.map(ui => ui.interest)
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la création du profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Vérifier le statut d'authentification
router.get('/me', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        interests: {
          include: {
            interest: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user.id,
      walletAddress: user.walletAddress,
      username: user.username,
      isPremium: user.isPremium,
      premiumUntil: user.premiumUntil,
      profileImage: user.profileImage,
      interests: user.interests.map(ui => ui.interest),
      badges: user.badges.map(ub => ub.badge),
      createdAt: user.createdAt
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
