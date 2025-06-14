import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// CORS middleware configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('EventEase Backend is running');
});

// Connect to MongoDB
try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease')
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} catch (error) {
    console.error('Failed to connect to MongoDB:', error);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});