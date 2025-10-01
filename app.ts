import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dteRoutes from './src/routes/dte.js';
import siiRoutes from './src/routes/sii.js';
import notasRoutes from './src/routes/notas.js';
import schedulerRoutes from './src/routes/scheduler.js';
import { testConnection } from './src/config/db.js';
import './src/models/index.js'; // Initialize models

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server default
    'http://localhost:5174', // Vite dev server alternative port
    'http://localhost:3000', // Same origin
    'http://127.0.0.1:5173', // Alternative localhost
    'http://127.0.0.1:5174', // Alternative localhost alternative port
    'https://consultassii.netlify.app', // Netlify production site
    'https://consultas-sii-api.vercel.app', // Vercel production site
    'https://consultas-sii-gs1gi0v01-tiagos-projects-df2f6730.vercel.app', // Old Vercel URL
    // Allow any Netlify subdomain for branch deploys
    /^https:\/\/[a-zA-Z0-9-]+--consultassii\.netlify\.app$/,
    /^https:\/\/consultassii--[a-zA-Z0-9-]+\.netlify\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SII Data API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/scheduler/health',
      sii_fetch: '/api/sii/fetch/:year/:month',
      sii_store: '/api/sii/fetch-and-store/:year/:month (requires auth)'
    },
    docs: 'See GitHub repository for full documentation'
  });
});

app.use('/api/dte', dteRoutes);
app.use('/api/sii', siiRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api', notasRoutes); 

const start = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models (don't force in production)
    // Skip sync for now to test basic connection
    // await syncDatabase(process.env.NODE_ENV !== 'production');
    
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();