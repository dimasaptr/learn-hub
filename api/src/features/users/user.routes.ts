import { Router } from 'express';
import { UserController } from './controllers/user.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : user.routes.ts
 * Type        : Routes
 * Feature     : Feature 2 (User & Profile)
 * Owner       : Dimas
 * Description : Define API endpoints for user profile management
 * Source Path : api/src/features/users/user.routes.ts
 * =========================================
 */

const router = Router();
const userController = new UserController();

// Protected Routes (Require Login)
router.get('/profile', verifyToken, userController.getProfile);
router.patch('/profile', verifyToken, userController.updateName);
router.patch('/change-password', verifyToken, userController.changePassword);

// Public Route
router.post('/forgot-password', userController.forgotPassword);

export default router;
