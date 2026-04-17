import { Request, Response, NextFunction } from 'express';
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
export declare class AuthController {
    private authService;
    constructor();
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map