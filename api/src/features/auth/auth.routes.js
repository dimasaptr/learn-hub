"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./controllers/auth.controller");
/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.routes.ts
 * Type        : Routes
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Routing for Authentication
 * Source Path : src/features/auth/auth.routes.ts
 * =========================================
 */
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map