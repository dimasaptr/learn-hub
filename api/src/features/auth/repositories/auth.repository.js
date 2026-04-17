"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/config/prisma"));
const client_1 = require("@prisma/client");
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
class AuthRepository {
    async createUser(data) {
        return await prisma_1.default.user.create({
            data,
        });
    }
    async findByEmail(email) {
        return await prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async findByReferralCode(referralCode) {
        return await prisma_1.default.user.findUnique({
            where: { referralCode },
        });
    }
    // Used for referral logic in transaction
    async addPointsToUser(userId, amount, expiresAt) {
        return await prisma_1.default.point.create({
            data: {
                userId,
                amount,
                expiresAt,
            },
        });
    }
    async addCouponToUser(userId, code, amount, expiresAt) {
        return await prisma_1.default.coupon.create({
            data: {
                userId,
                code,
                amount,
                expiresAt,
            },
        });
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map