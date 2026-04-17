/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : dashboard.repository.ts
 * Type        : Repository
 * Feature     : Feature 2 (Organizer Dashboard)
 * Owner       : Dimas
 * Description : DB queries for statistics and organizer transactions
 * Source Path : api/src/features/dashboard/repositories/dashboard.repository.ts
 * =========================================
 */
import prisma from '../../../shared/config/prisma.js';
export class DashboardRepository {
    async getOrganizerTransactions(organizerId) {
        return prisma.transaction.findMany({
            where: {
                event: {
                    organizerId: organizerId
                }
            },
            include: {
                event: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getIncomeData(organizerId) {
        return prisma.transaction.findMany({
            where: {
                event: {
                    organizerId: organizerId
                },
                status: 'DONE'
            },
            select: {
                totalPrice: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    }
    async getSummaryStats(organizerId) {
        const events = await prisma.event.count({
            where: { organizerId }
        });
        const transactions = await prisma.transaction.aggregate({
            where: {
                event: { organizerId },
                status: 'DONE'
            },
            _sum: {
                totalPrice: true
            },
            _count: {
                id: true
            }
        });
        return {
            totalEvents: events,
            totalIncome: transactions._sum.totalPrice || 0,
            totalTicketsSold: transactions._count.id || 0
        };
    }
}
