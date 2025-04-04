import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import dngRoutes from './routes/dengueDataRoutes.js';
import monthRoutes from "./routes/monthRoutes.js";
import graphsRoutes from './routes/graphsRoutes.js';
import userGraphsRoutes from './routes/userGraphsRoutes.js';
import weeklyDngDataRoutes from './routes/weeklyDngDataRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js'
// Import your routes


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Select the server running port
const port = process.env.PORT || 5000;

// Make the database Connection
connectDB();  // config -> db..js

// Use express framework
const app = express();





// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,                // Allow cookies (e.g.,  JWT) to be sent/received
}));


// Serve static files from the uploads folder using the environment variable
const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));


// Define your routes
app.get('/dengue_risk', (req, res) => {
  // Return JSON data
  res.json({ title: "Dengue Risk Data", data: [] });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/dngData', dngRoutes);
app.use('/api/months', monthRoutes);
app.use('/api/graphs', graphsRoutes);
app.use('/api/usergraphs',userGraphsRoutes);
app.use('/api/weeklyDngData', weeklyDngDataRoutes);
// Use feedback routes
app.use('/api/feedback', feedbackRoutes);


// Select the development mode or product mode
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error Handles
app.use(notFound);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));
