import createEvent, { getEventsByUser, getAllEvents } from '../controllers/eventController.js';
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-event', authenticateUser, createEvent);
router.get('/getEventsByUser', getEventsByUser);
router.get('/getAllEvents', getAllEvents);


export default router;