/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.service.ts
 * Type        : Service
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Business logic for Authentication and Referral
 * Source Path : src/features/auth/services/auth.service.ts
 * Used In     : Auth Controller
 * Status      : ACTIVE
 * =========================================
 */
export declare class AuthService {
    private authRepository;
    constructor();
    register(data: any): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            referralCode: string;
        };
    }>;
    login(data: any): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map