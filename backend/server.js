import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Note: We're mounting on /auth not /api/auth to match your frontend request
app.use('/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('EventEase API is running');
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