import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import matchRoutes from './routes/match';
import chatRoutes from './routes/chat';
import paymentRoutes from './routes/payment';
import gamificationRoutes from './routes/gamification';

// Services
import { SolanaService } from './services/solanaService';
import { ChatService } from './services/chatService';
import { PaymentService } from './services/paymentService';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Database
export const prisma = new PrismaClient();

// Redis
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Services
export const solanaService = new SolanaService();
export const chatService = new ChatService(io);
export const paymentService = new PaymentService();

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/match', authMiddleware, matchRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/payment', authMiddleware, paymentRoutes);
app.use('/api/gamification', authMiddleware, gamificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
      const message = await chatService.sendMessage(matchId, senderId, content, messageType);
      
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
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Arrêt du serveur...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  try {
    await redis.connect();
    logger.info(`Serveur démarré sur le port ${PORT}`);
    logger.info(`Environnement: ${process.env.NODE_ENV}`);
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
});

export { io };
