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
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
