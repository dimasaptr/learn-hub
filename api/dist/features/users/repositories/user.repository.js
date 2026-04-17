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
export class UserRepository {
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async updateName(id, name) {
        return prisma.user.update({
            where: { id },
            data: { name },
        });
    }
    async updatePassword(id, newPasswordHash) {
        return prisma.user.update({
            where: { id },
            data: { password: newPasswordHash },
        });
    }
}
