/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.controller.ts
 * Type        : Controller
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Handle HTTP requests for Auth
 * Source Path : src/features/auth/controllers/auth.controller.ts
 * Used In     : Auth Routes
 * Status      : ACTIVE
 * =========================================
 */
import { AuthService } from '../services/auth.service.js';
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json({
                message: 'Registration successful',
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json({
                message: 'Login successful',
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
