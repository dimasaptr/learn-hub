import { PrismaClient } from '@prisma/client';

/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : prisma.ts
 * Type        : Config / Provider
 * Feature     : Shared
 * Owner       : Dimas
 * Description : Centralized Prisma client instance
 * Source Path : src/shared/config/prisma.ts
 * =========================================
 */

const prisma = new PrismaClient();

export default prisma;
