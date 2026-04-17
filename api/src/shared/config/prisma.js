"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
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
const prisma = new client_1.PrismaClient();
exports.default = prisma;
//# sourceMappingURL=prisma.js.map