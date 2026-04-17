/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : user.repository.ts
 * Type        : Repository
 * Feature     : Feature 2 (User & Referral)
 * Owner       : Dimas
 * Description : Handle DB queries for user profile operations
 * Source Path : api/src/features/users/repositories/user.repository.ts
 * =========================================
 */

import prisma from '../../../shared/config/prisma.js';
import { Prisma } from '@prisma/client';
import type { User } from '@prisma/client';

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateName(id: number, name: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { name },
    });
  }

  async updatePassword(id: number, newPasswordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: newPasswordHash },
    });
  }

  async findActivePoints(userId: number) {
    return prisma.point.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
        isUsed: false
      }
    });
  }

  async findActiveCoupons(userId: number) {
    return prisma.coupon.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
        isUsed: false
      }
    });
  }
}
