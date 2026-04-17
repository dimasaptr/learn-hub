import { Request, Response, NextFunction } from 'express';
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
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeRoles: (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map