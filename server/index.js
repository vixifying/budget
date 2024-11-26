import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb+srv://iqviavikram:0GKZVPU5uTeyUEFH@cluster0.xlbyk.mongodb.net/expense-manager?retryWrites=true&w=majority';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 60000,
  family: 4
};

let retryCount = 0;
const maxRetries = 5;
const retryInterval = 5000;

const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      startServer();
    })
    .catch((err) => {
      console.error(`MongoDB connection attempt ${retryCount + 1} failed:`, err.message);
      
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying connection in ${retryInterval/1000} seconds... (${retryCount}/${maxRetries})`);
        setTimeout(connectWithRetry, retryInterval);
      } else {
        console.error('Max retry attempts reached. Could not connect to MongoDB.');
        process.exit(1);
      }
    });
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err);
    process.exit(1);
  }
});

// Initialize connection
connectWithRetry();