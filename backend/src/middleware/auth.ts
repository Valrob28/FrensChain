import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    walletAddress: string;
    username: string;
    isPremium: boolean;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        walletAddress: true,
        username: true,
        isPremium: true,
        premiumUntil: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'abonnement premium est encore valide
    if (user.premiumUntil && new Date() > user.premiumUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isPremium: false, premiumUntil: null }
      });
      user.isPremium = false;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    return res.status(401).json({ error: 'Token invalide' });
  }
};
