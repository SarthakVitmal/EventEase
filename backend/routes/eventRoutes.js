import createEvent, { getEventsByUser, getAllEvents, uploadEventImage } from '../controllers/eventController.js';
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../cloudConfig.js';

const router = express.Router();

router.post('/create-event', authenticateUser, createEvent);
router.get('/getEventsByUser', getEventsByUser);
router.get('/getAllEvents', getAllEvents);
router.post('/upload-image',
    (req, res, next) => {
        console.log('Request received for upload'); // Debug log
        next();
    },
    upload.single('image'), // Must match the FormData field name
    (req, res, next) => {
        console.log('File after Multer:', req.file); // Debug log
        next();
    },
    uploadEventImage
);

export default router;