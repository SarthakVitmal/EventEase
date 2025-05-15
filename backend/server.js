import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Backend is running');
})

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
  app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});