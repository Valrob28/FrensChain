import { Router } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Obtenir les badges de l'utilisateur
router.get('/badges', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { earnedAt: 'desc' }
    });

    res.json(userBadges.map(ub => ({
      id: ub.id,
      badge: ub.badge,
      earnedAt: ub.earnedAt
    })));
  } catch (error) {
    logger.error('Erreur lors de la récupération des badges:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir tous les badges disponibles
router.get('/badges/available', async (req, res) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(badges);
  } catch (error) {
    logger.error('Erreur lors de la récupération des badges disponibles:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir le leaderboard des referrers
router.get('/leaderboard/referrers', async (req, AuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;

    const topReferrers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        profileImage: true,
        _count: {
          select: {
            referrals: true
          }
        }
      },
      orderBy: {
        referrals: {
          _count: 'desc'
        }
      },
      take: Number(limit)
    });

    const formattedReferrers = topReferrers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
      referralCount: user._count.referrals
    }));

    res.json(formattedReferrers);
  } catch (error) {
    logger.error('Erreur lors de la récupération du leaderboard:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les statistiques de gamification
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [badgeCount, referralCount, referralReward] = await Promise.all([
      prisma.userBadge.count({ where: { userId } }),
      prisma.referral.count({ where: { referrerId: userId } }),
      prisma.referral.aggregate({
        where: { referrerId: userId },
        _sum: { rewardAmount: true }
      })
    ]);

    res.json({
      badgeCount,
      referralCount,
      totalReferralReward: referralReward._sum.rewardAmount || 0
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques de gamification:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer un code de parrainage
router.post('/referral-code', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code de parrainage requis' });
    }

    // Vérifier que le code n'existe pas déjà
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referrerId: userId,
        referred: {
          username: code
        }
      }
    });

    if (existingReferral) {
      return res.status(400).json({ error: 'Code de parrainage déjà utilisé' });
    }

    // Trouver l'utilisateur par son nom d'utilisateur
    const referredUser = await prisma.user.findUnique({
      where: { username: code }
    });

    if (!referredUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (referredUser.id === userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous parrainer vous-même' });
    }

    // Créer le parrainage
    const referral = await prisma.referral.create({
      data: {
        referrerId: userId,
        referredId: referredUser.id,
        rewardAmount: 0.01 // 0.01 SOL de récompense
      }
    });

    // Attribuer des badges
    await this.awardBadges(userId, 'referrer');
    await this.awardBadges(referredUser.id, 'referred');

    res.json({
      success: true,
      referral,
      message: 'Parrainage créé avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors de la création du parrainage:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Fonction utilitaire pour attribuer des badges
async function awardBadges(userId: string, badgeType: string) {
  try {
    let badgeName = '';
    let badgeDescription = '';

    switch (badgeType) {
      case 'early_supporter':
        badgeName = 'Early Supporter';
        badgeDescription = 'Parmi les 2000 premiers utilisateurs';
        break;
      case 'referrer':
        badgeName = 'Referrer';
        badgeDescription = 'A parrainé un ami';
        break;
      case 'referred':
        badgeName = 'Referred';
        badgeDescription = 'A été parrainé par un ami';
        break;
      case 'active_user':
        badgeName = 'Active User';
        badgeDescription = 'Utilisateur actif';
        break;
      default:
        return;
    }

    // Créer le badge s'il n'existe pas
    const badge = await prisma.badge.upsert({
      where: { name: badgeName },
      update: {},
      create: {
        name: badgeName,
        description: badgeDescription,
        rarity: badgeType === 'early_supporter' ? 'legendary' : 'common'
      }
    });

    // Attribuer le badge à l'utilisateur
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      },
      update: {},
      create: {
        userId,
        badgeId: badge.id
      }
    });
  } catch (error) {
    logger.error('Erreur lors de l\'attribution du badge:', error);
  }
}

export default router;
