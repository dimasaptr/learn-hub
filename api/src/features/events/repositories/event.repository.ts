/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : event.repository.ts
 * Type        : Repository
 * Feature     : Feature 1 - Event Discovery & Detail
 * Owner       : Simon
 * Description : Database interactions for events (search, filter, detail)
 * Source Path : src/features/events/repositories/event.repository.ts
 * Used In     : Event Service
 * Status      : ACTIVE
 * =========================================
 */

import prisma from '../../../shared/config/prisma.js';

export interface EventSearchFilters {
  search?: string;
  category?: string;
  location?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CANCELED';
  isUpcoming?: boolean;
}

export interface EventListOptions {
  page?: number;
  limit?: number;
  orderBy?: 'startDate' | 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}

export class EventRepository {
  /**
   * Get all events with optional filters and pagination
   */
  async findAll(
    filters: EventSearchFilters = {},
    options: EventListOptions = {}
  ): Promise<{ events: any[]; total: number; page: number; totalPages: number }> {
    const {
      search,
      category,
      location,
      status = 'PUBLISHED',
      isUpcoming,
    } = filters;

    const {
      page = 1,
      limit = 10,
      orderBy = 'startDate',
      order = 'asc',
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {
      status,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (isUpcoming) {
      where.startDate = { gt: new Date() };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              transactions: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      totalPages,
    };
  }

  async findById(id: number) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        vouchers: {
          where: {
            expiresAt: { gt: new Date() },
            quota: { gt: 0 },
          },
        },
        _count: {
          select: {
            reviews: true,
            transactions: {
              where: {
                status: 'DONE',
              },
            },
          },
        },
      },
    });
  }

  async getCategories(): Promise<string[]> {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      select: { category: true },
      distinct: ['category'],
    });
    return events.map((e: { category: string }) => e.category);
  }

  async getLocations(): Promise<string[]> {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      select: { location: true },
      distinct: ['location'],
    });
    return events.map((e: { location: string }) => e.location);
  }

  async getRelatedEvents(eventId: number, category: string, limit: number = 4) {
    return await prisma.event.findMany({
      where: {
        id: { not: eventId },
        category: { equals: category, mode: 'insensitive' },
        status: 'PUBLISHED',
        endDate: { gt: new Date() },
      },
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async autoArchiveEvents(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await prisma.event.updateMany({
      where: {
        status: 'PUBLISHED',
        endDate: { lt: sevenDaysAgo },
      },
      data: {
        status: 'ARCHIVED',
      },
    });

    return result.count;
  }
}