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
import prisma from '../../../shared/config/prisma.js';
export class AuthRepository {
    async createUser(data) {
        return await prisma.user.create({
            data,
        });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
    async findByReferralCode(referralCode) {
        return await prisma.user.findUnique({
            where: { referralCode },
        });
    }
    // Used for referral logic in transaction
    async addPointsToUser(userId, amount, expiresAt) {
        return await prisma.point.create({
            data: {
                userId,
                amount,
                expiresAt,
            },
        });
    }
    async addCouponToUser(userId, code, amount, expiresAt) {
        return await prisma.coupon.create({
            data: {
                userId,
                code,
                amount,
                expiresAt,
            },
        });
    }
}
