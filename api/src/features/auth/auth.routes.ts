import { Router } from 'express';
import { AuthController } from './controllers/auth.controller.js';

/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.routes.ts
 * Type        : Routes
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Routing for Authentication
 * Source Path : src/features/auth/auth.routes.ts
 * =========================================
 */

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
