/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : events.routes.ts
 * Type        : Routes
 * Feature     : Feature 1 - Event Discovery & Detail
 * Owner       : Simon
 * Description : Routing for Events
 * Source Path : src/features/events/events.routes.ts
 * =========================================
 */

import { Router } from 'express';
import { EventController } from './controllers/event.controller.js';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/filters', eventController.getFilterOptions);
router.get('/:id', eventController.getEventById);
router.post('/auto-archive', eventController.autoArchiveEvents);

export default router;