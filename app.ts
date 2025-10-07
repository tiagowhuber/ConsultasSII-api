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
    // For serverless (Vercel), don't block on database connection
    // Database will connect lazily when first needed
    if (process.env.VERCEL !== '1') {
      // Only test connection in non-serverless environments
      await testConnection();
      console.log('Database connection verified');
    } else {
      // In Vercel, test connection in background (non-blocking)
      testConnection()
        .then(() => console.log('Database connection verified'))
        .catch((err) => console.warn('Database connection failed (will retry on first use):', err.message));
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Mock mode: ${process.env.USE_MOCK === 'true' ? 'ENABLED' : 'DISABLED'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();