/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : event.service.ts
 * Type        : Service
 * Feature     : Feature 1 - Event Discovery & Detail
 * Owner       : Simon
 * Description : Business logic for events
 * Source Path : src/features/events/services/event.service.ts
 * Used In     : Event Controller
 * Status      : ACTIVE
 * =========================================
 */

import { EventRepository, type EventSearchFilters, type EventListOptions } from '../repositories/event.repository.js';

export interface SearchEventsQuery {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  orderBy?: 'startDate' | 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async getEvents(query: SearchEventsQuery = {}) {
    const {
      search,
      category,
      location,
      page = 1,
      limit = 10,
      orderBy = 'startDate',
      order = 'asc',
    } = query;

    const filters: EventSearchFilters = {
      search,
      category,
      location,
      status: 'PUBLISHED',
    };

    const options: EventListOptions = {
      page: Number(page),
      limit: Number(limit),
      orderBy,
      order,
    };

    const result = await this.eventRepository.findAll(filters, options);

    return {
      ...result,
      message: result.events.length === 0 ? 'No events found' : 'Events retrieved successfully',
    };
  }

  async getUpcomingEvents(query: Omit<SearchEventsQuery, 'search'> = {}) {
    const {
      category,
      location,
      page = 1,
      limit = 10,
      orderBy = 'startDate',
      order = 'asc',
    } = query;

    const filters: EventSearchFilters = {
      category,
      location,
      status: 'PUBLISHED',
      isUpcoming: true,
    };

    const options: EventListOptions = {
      page: Number(page),
      limit: Number(limit),
      orderBy,
      order,
    };

    const result = await this.eventRepository.findAll(filters, options);

    return {
      ...result,
      message: result.events.length === 0 ? 'No upcoming events found' : 'Upcoming events retrieved successfully',
    };
  }

  async getEventById(id: number) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status === 'DRAFT' || event.status === 'CANCELED') {
      throw new Error('Event is not available');
    }

    const relatedEvents = await this.eventRepository.getRelatedEvents(
      event.id,
      event.category,
      4
    );

    return {
      event,
      relatedEvents,
      message: 'Event detail retrieved successfully',
    };
  }

  async getFilterOptions() {
    const [categories, locations] = await Promise.all([
      this.eventRepository.getCategories(),
      this.eventRepository.getLocations(),
    ]);

    return {
      categories,
      locations,
      message: 'Filter options retrieved successfully',
    };
  }

  async autoArchiveFinishedEvents() {
    const archivedCount = await this.eventRepository.autoArchiveEvents();

    return {
      archivedCount,
      message: `${archivedCount} events archived`,
    };
  }
}