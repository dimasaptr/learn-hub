/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.service.ts
 * Type        : Service
 * Feature     : Feature 2 - Auth
 * Owner       : Dimas
 * Description : Business logic for Authentication and Referral
 * Source Path : src/features/auth/services/auth.service.ts
 * Used In     : Auth Controller
 * Status      : ACTIVE
 * =========================================
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: any) {
    const { name, email, password, role, referredByCode } = data;

    // 1. Check if user exists
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate unique referral code (e.g., NAME-RANDOM or just RANDOM)
    let referralCode = '';
    let isUnique = false;
    while (!isUnique) {
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      const prefix = name.split(' ')[0].substring(0, 5).toUpperCase();
      referralCode = `${prefix}-${randomSuffix}`;
      const existingCode = await this.authRepository.findByReferralCode(referralCode);
      if (!existingCode) isUnique = true;
    }

    // 4. Handle referral logic if code exists
    let referredById: number | undefined;
    let referrer: User | null = null;
    
    if (referredByCode) {
      referrer = await this.authRepository.findByReferralCode(referredByCode);
      if (referrer) {
        referredById = referrer.id;
      }
    }

    // 5. Create user
    const newUser = await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || Role.CUSTOMER,
      referralCode,
      referredBy: referredById ? { connect: { id: referredById } } : undefined,
    });

    // 6. If referred, give rewards
    if (referrer) {
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      // Reward for Referrer: 10,000 Points
      await this.authRepository.addPointsToUser(referrer.id, 10000, threeMonthsLater);

      // Reward for New User: Discount Coupon
      const couponCode = `WELCOME-${newUser.referralCode}`;
      await this.authRepository.addCouponToUser(newUser.id, couponCode, 15, threeMonthsLater); // 15% discount or fixed amount logic
    }

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
    };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
