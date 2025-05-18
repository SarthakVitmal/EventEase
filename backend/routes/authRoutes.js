import express from 'express';
import { signup, login, logout, getUserFromToken } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getUser',authenticateUser, getUserFromToken);

export default router;