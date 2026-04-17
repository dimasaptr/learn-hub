/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : user.controller.ts
 * Type        : Controller
 * Feature     : Feature 2 (User & Referral)
 * Owner       : Dimas
 * Description : Handle HTTP requests for User Profile Operations
 * Source Path : api/src/features/users/controllers/user.controller.ts
 * =========================================
 */

import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

export class UserController {
  private userService = new UserService();

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - Assuming authMiddleware adds userId to req.user
      const userId = req.user?.id;
      
      const profile = await this.userService.getProfile(userId);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  };

  updateName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore
      const userId = req.user?.id;
      const { name } = req.body;
      
      const updatedProfile = await this.userService.updateName(userId, name);
      res.status(200).json({ 
        status: 'success', 
        message: 'Name updated successfully',
        data: updatedProfile 
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore
      const userId = req.user?.id;
      const { oldPassword, newPassword } = req.body;

      await this.userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  };

  getRewards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore
      const userId = req.user?.id;
      const rewards = await this.userService.getRewards(userId);
      res.status(200).json({ status: 'success', data: rewards });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) throw new Error('Email is required');
      
      await this.userService.triggerForgotPassword(email);
      
      res.status(200).json({
        status: 'success',
        message: 'If the email exists, a reset link simulated output will be printed to the backend console.'
      });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  };
}
