import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.middleware.ts
 * Type        : Middleware
 * Feature     : Shared
 * Owner       : Dimas
 * Description : JWT verification and RBAC
 * Source Path : src/shared/middlewares/auth.middleware.ts
 * =========================================
 */

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: Role;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required', status: 'error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', status: 'error' });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access forbidden: Insufficient permissions', 
        status: 'error' 
      });
    }
    next();
  };
};
