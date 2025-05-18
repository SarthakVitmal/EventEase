import createEvent from '../controllers/eventController.js';
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-event', authenticateUser, createEvent);

export default router;