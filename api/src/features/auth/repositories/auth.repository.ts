import prisma from '../../../shared/config/prisma.js';
import type { Prisma, User } from '@prisma/client';

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

export class AuthRepository {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { referralCode },
    });
  }

  // Used for referral logic in transaction
  async addPointsToUser(userId: number, amount: number, expiresAt: Date) {
    return await prisma.point.create({
      data: {
        userId,
        amount,
        expiresAt,
      },
    });
  }

  async addCouponToUser(userId: number, code: string, amount: number, expiresAt: Date) {
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
