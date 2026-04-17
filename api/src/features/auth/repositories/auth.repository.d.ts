import { Prisma, User } from '@prisma/client';
/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.repository.ts
 * Type        : Repository
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Database interactions for authentication
 * Source Path : src/features/auth/repositories/auth.repository.ts
 * Used In     : Auth Service
 * Status      : ACTIVE
 * =========================================
 */
export declare class AuthRepository {
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByReferralCode(referralCode: string): Promise<User | null>;
    addPointsToUser(userId: number, amount: number, expiresAt: Date): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        expiresAt: Date;
        isUsed: boolean;
        userId: number;
    }>;
    addCouponToUser(userId: number, code: string, amount: number, expiresAt: Date): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        expiresAt: Date;
        isUsed: boolean;
        userId: number;
        code: string;
    }>;
}
//# sourceMappingURL=auth.repository.d.ts.map