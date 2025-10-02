import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Routes simples pour les tests
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'FrensChain Backend is running!'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'FrensChain API is working!',
    features: [
      'Authentication with Solana wallets',
      'User profiles and interests',
      'Matching system',
      'Real-time chat',
      'Premium subscriptions',
      'Gamification and badges'
    ],
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      pricing: '/api/pricing'
    }
  });
});

app.get('/api/pricing', (req, res) => {
  res.json({
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
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connecté: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { matchId, userId } = data;
    socket.join(`match_${matchId}`);
    logger.info(`Utilisateur ${userId} a rejoint le match ${matchId}`);
  });

  socket.on('leave_room', (data) => {
    const { matchId, userId } = data;
    socket.leave(`match_${matchId}`);
    logger.info(`Utilisateur ${userId} a quitté le match ${matchId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { matchId, senderId, content, messageType } = data;
      logger.info(`Message reçu: ${content} de ${senderId} dans ${matchId}`);
      
      // Simuler l'envoi du message
      const message = {
        id: `msg_${Date.now()}`,
        content,
        senderId,
        messageType: messageType || 'text',
        createdAt: new Date().toISOString()
      };
      
      io.to(`match_${matchId}`).emit('new_message', message);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du message:', error);
      socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  });

  socket.on('typing_start', (data) => {
    const { matchId, userId } = data;
    socket.to(`match_${matchId}`).emit('user_typing', { userId, isTyping: true });
  });

  socket.on('typing_stop', (data) => {
    const { matchId, userId } = data;
    socket.to(`match_${matchId}`).emit('user_typing', { userId, isTyping: false });
  });

  socket.on('disconnect', () => {
    logger.info(`Client déconnecté: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Arrêt du serveur...');
  process.exit(0);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`🚀 Serveur FrensChain démarré sur le port ${PORT}`);
  logger.info(`📱 Frontend: http://localhost:3000`);
  logger.info(`🔧 Backend API: http://localhost:3001`);
  logger.info(`📊 Health Check: http://localhost:3001/api/health`);
  logger.info(`🧪 Test: http://localhost:3001/api/test`);
  logger.info(`💰 Pricing: http://localhost:3001/api/pricing`);
  logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

export { io };
