import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Mettre à jour le profil
router.put('/profile', async (req: AuthRequest, res) => {
  try {
    const { username, interests } = req.body;
    const userId = req.user!.id;

    const updateData: any = {};
    
    if (username) {
      // Vérifier que le nom d'utilisateur n'est pas déjà pris
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Nom d\'utilisateur déjà utilisé' });
      }
      updateData.username = username;
    }

    if (interests) {
      // Supprimer les anciens intérêts
      await prisma.userInterest.deleteMany({
        where: { userId }
      });

      // Ajouter les nouveaux intérêts
      if (interests.length > 0) {
        const interestRecords = await Promise.all(
          interests.map(async (interestName: string) => {
            return prisma.interest.upsert({
              where: { name: interestName },
              update: {},
              create: { name: interestName }
            });
          })
        );

        await prisma.userInterest.createMany({
          data: interestRecords.map(interest => ({
            userId,
            interestId: interest.id
          }))
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        interests: {
          include: {
            interest: true
          }
        }
      }
    });

    res.json({
      id: user.id,
      username: user.username,
      interests: user.interests.map(ui => ui.interest),
      profileImage: user.profileImage
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Upload de photo de profil
router.post('/profile-image', upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const userId = req.user!.id;
    const filePath = req.file.path;

    // Redimensionner l'image
    const resizedPath = filePath.replace(/\.[^/.]+$/, '_resized.jpg');
    await sharp(filePath)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(resizedPath);

    // Supprimer l'image originale
    fs.unlinkSync(filePath);

    // Mettre à jour l'utilisateur avec le nouveau chemin d'image
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: resizedPath }
    });

    res.json({
      profileImage: user.profileImage
    });
  } catch (error) {
    logger.error('Erreur lors de l\'upload de l\'image:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Obtenir les profils à découvrir
router.get('/discover', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, interests } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Récupérer les utilisateurs déjà likés
    const likedUsers = await prisma.like.findMany({
      where: { senderId: userId },
      select: { receiverId: true }
    });

    const likedUserIds = likedUsers.map(like => like.receiverId);

    // Construire les filtres
    const whereClause: any = {
      id: { not: userId },
      NOT: { id: { in: likedUserIds } }
    };

    if (interests && Array.isArray(interests)) {
      whereClause.interests = {
        some: {
          interest: {
            name: { in: interests }
          }
        }
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        interests: {
          include: {
            interest: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json(users.map(user => ({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
      interests: user.interests.map(ui => ui.interest),
      isPremium: user.isPremium
    })));
  } catch (error) {
    logger.error('Erreur lors de la récupération des profils:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les statistiques de l'utilisateur
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [likesSent, likesReceived, matches, messages] = await Promise.all([
      prisma.like.count({ where: { senderId: userId } }),
      prisma.like.count({ where: { receiverId: userId } }),
      prisma.match.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }]
        }
      }),
      prisma.message.count({
        where: {
          sender: { id: userId }
        }
      })
    ]);

    res.json({
      likesSent,
      likesReceived,
      matches,
      messages
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
