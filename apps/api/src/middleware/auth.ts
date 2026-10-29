import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { ApiError } from './errorHandler';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    prisma.adminUser.findUnique({ where: { id: decoded.userId } })
      .then((user) => {
        if (!user) {
          return next(ApiError.unauthorized('User not found'));
        }
        req.user = { id: user.id, email: user.email, role: user.role };
        next();
      })
      .catch(next);
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };
}
