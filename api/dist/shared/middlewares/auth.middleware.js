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
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required', status: 'error' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', status: 'error' });
    }
};
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access forbidden: Insufficient permissions',
                status: 'error'
            });
        }
        next();
    };
};
