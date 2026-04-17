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
declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map