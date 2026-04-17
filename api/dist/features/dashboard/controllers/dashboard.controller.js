/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : dashboard.controller.ts
 * Type        : Controller
 * Feature     : Feature 2 (Organizer Dashboard)
 * Owner       : Dimas
 * Description : Handle HTTP requests for organizer reporting
 * Source Path : api/src/features/dashboard/controllers/dashboard.controller.ts
 * =========================================
 */
import { DashboardService } from '../services/dashboard.service.js';
export class DashboardController {
    dashboardService = new DashboardService();
    getStats = async (req, res, next) => {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            // @ts-ignore
            const userRole = req.user?.role;
            if (userRole !== 'ORGANIZER') {
                res.status(403).json({ status: 'error', message: 'Access denied. Organizers only.' });
                return;
            }
            const stats = await this.dashboardService.getStatistics(userId);
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (error) {
            next(error);
        }
    };
    getTransactions = async (req, res, next) => {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            const transactions = await this.dashboardService.getTransactions(userId);
            res.status(200).json({ status: 'success', data: transactions });
        }
        catch (error) {
            next(error);
        }
    };
}
