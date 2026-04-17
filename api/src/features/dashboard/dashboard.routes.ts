/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : dashboard.routes.ts
 * Type        : Routes
 * Feature     : Feature 2 (Organizer Dashboard)
 * Owner       : Dimas
 * Description : Define API endpoints for statistics and management
 * Source Path : api/src/features/dashboard/dashboard.routes.ts
 * =========================================
 */

import { Router } from 'express';
import { DashboardController } from './controllers/dashboard.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.get('/statistics', verifyToken, dashboardController.getStats);
router.get('/transactions', verifyToken, dashboardController.getTransactions);

export default router;
