import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import type { User } from '@prisma/client';

/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : user.service.ts
 * Type        : Service
 * Feature     : Feature 2 (User & Referral)
 * Owner       : Dimas
 * Description : Central logic for user profile and security
 * Source Path : api/src/features/users/services/user.service.ts
 * =========================================
 */

export class UserService {
  private userRepository = new UserRepository();

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Omit password
    const { password, ...userProfile } = user;
    return userProfile;
  }

  async updateName(userId: number, name: string): Promise<Partial<User>> {
    if (!name) throw new Error('Name is required');

    const updatedUser = await this.userRepository.updateName(userId, name);
    const { password, ...userProfile } = updatedUser;
    return userProfile;
  }

  async changePassword(userId: number, oldPass: string, newPass: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isValidPassword = await bcrypt.compare(oldPass, user.password);
    if (!isValidPassword) throw new Error('Invalid old password');

    const newHashedPassword = await bcrypt.hash(newPass, 10);
    await this.userRepository.updatePassword(userId, newHashedPassword);
    
    return true;
  }

  // CONSOLE SIMULATION FOR FORGOT PASSWORD
  async triggerForgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't throw error to prevent email enumeration, just return simulated success
      console.log(`[SIMULATION] Forgot password requested for unknown email: ${email}`);
      return true;
    }

    // In a real app, generate a JWT token and send an email
    // Since we avoid nodemailer for now to keep it simple, we simulate it on terminal
    const simulatedToken = 'simulated_reset_token_' + user.id;
    const resetLink = `http://localhost:5173/reset-password?token=${simulatedToken}`;

    console.log(`\n==============================================`);
    console.log(`[EMAIL SIMULATION] FORGOT PASSWORD ACTIVATED`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: Reset Your Password`);
    console.log(`Message: Click the link below to reset your password:`);
    console.log(`Link: ${resetLink}`);
    console.log(`==============================================\n`);

    return true;
  }
}
