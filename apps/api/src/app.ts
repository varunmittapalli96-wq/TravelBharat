import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { createPublicRoutes } from './routes/v1/index';
import { createAdminRoutes } from './routes/v1/admin/index';
import { setupSwagger } from './config/swagger';

export const prisma = new PrismaClient();

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  // CORS
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // General rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1', createPublicRoutes());
  app.use('/api/v1/admin', createAdminRoutes());

  // Swagger docs
  setupSwagger(app);

  // Error handler
  app.use(errorHandler);

  return app;
}
