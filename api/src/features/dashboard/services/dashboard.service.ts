/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : dashboard.service.ts
 * Type        : Service
 * Feature     : Feature 2 (Organizer Dashboard)
 * Owner       : Dimas
 * Description : Business logic for statistics formatting
 * Source Path : api/src/features/dashboard/services/dashboard.service.ts
 * =========================================
 */

import { DashboardRepository } from '../repositories/dashboard.repository.js';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getStatistics(organizerId: number) {
    const rawData = await this.dashboardRepository.getIncomeData(organizerId);
    const summary = await this.dashboardRepository.getSummaryStats(organizerId);

    // Grouping logic (Day by Day)
    const chartDataMap: Record<string, number> = {};

    rawData.forEach((item) => {
      const date = item.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      chartDataMap[date] = (chartDataMap[date] || 0) + item.totalPrice;
    });

    const chartData = Object.keys(chartDataMap).map((date) => ({
      date,
      income: chartDataMap[date]
    }));

    return {
      summary,
      chartData
    };
  }

  async getTransactions(organizerId: number) {
    return this.dashboardRepository.getOrganizerTransactions(organizerId);
  }
}
