import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { setupRoutes } from './routes';
import { setupMiddleware } from './middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });