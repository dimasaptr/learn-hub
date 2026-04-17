/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : event.controller.ts
 * Type        : Controller
 * Feature     : Feature 1 - Event Discovery & Detail
 * Owner       : Simon
 * Description : Handle HTTP requests for events
 * Source Path : src/features/events/controllers/event.controller.ts
 * Used In     : Event Routes
 * Status      : ACTIVE
 * =========================================
 */

import type { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service.js';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.getEvents(req.query);
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          events: result.events,
          pagination: {
            page: result.page,
            limit: Number(req.query.limit as string) || 10,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  };

  getUpcomingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.getUpcomingEvents(req.query);
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          events: result.events,
          pagination: {
            page: result.page,
            limit: Number(req.query.limit as string) || 10,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  };

  getFilterOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.getFilterOptions();
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          categories: result.categories,
          locations: result.locations,
        },
      });
    } catch (error: any) {
      next(error);
    }
  };

  getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid event ID',
        });
        return;
      }

      const result = await this.eventService.getEventById(id);
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          event: result.event,
          relatedEvents: result.relatedEvents,
        },
      });
    } catch (error: any) {
      if (error.message === 'Event not found') {
        res.status(404).json({
          status: 'error',
          message: error.message,
        });
        return;
      }
      if (error.message === 'Event is not available') {
        res.status(403).json({
          status: 'error',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  autoArchiveEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.autoArchiveFinishedEvents();
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          archivedCount: result.archivedCount,
        },
      });
    } catch (error: any) {
      next(error);
    }
  };
}