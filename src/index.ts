// Load environment variables first (before any other imports)
import './config/env';

import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
// Allow requests from any origin. This is crucial for local development
// where the frontend and backend are on different ports.
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for image data

// API Routes
app.use('/api', apiRouter);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('FindTogether Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
