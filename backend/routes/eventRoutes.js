import createEvent, { getEventsByUser, getAllEvents, uploadEventImage, getEventById, eventRegistration, getUserRegisteredEvents } from '../controllers/eventController.js';
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../cloudConfig.js';

const router = express.Router();

router.post('/create-event', authenticateUser, createEvent);
router.get('/getEventsByUser', getEventsByUser);
router.get('/getAllEvents', getAllEvents);
router.post('/upload-image',
    (req, res, next) => {
        next();
    },
    upload.single('image'),
    (req, res, next) => {
        next();
    },
    uploadEventImage
);
router.get('/:id', getEventById);
router.post('/:id/register', authenticateUser, eventRegistration);
router.get('/:id/getUserRegisteredEvents', authenticateUser, getUserRegisteredEvents);

export default router;