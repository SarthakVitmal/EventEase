import createEvent, { getEventsByUser } from '../controllers/eventController.js';
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-event', authenticateUser, createEvent);
router.get('/getEventsByUser', getEventsByUser);

export default router;