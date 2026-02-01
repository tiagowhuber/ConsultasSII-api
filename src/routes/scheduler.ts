import express, { Request, Response } from 'express';
import { authenticateScheduler } from '../middleware/scheduler-auth.js';

const router = express.Router();

// Health check endpoint (public)
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    timezone: 'America/Santiago',
    environment: process.env.NODE_ENV || 'development',
    scheduler_type: 'GitHub Actions',
    message: 'API is ready to receive scheduled requests'
  });
});

// Status endpoint with authentication
router.get('/status', authenticateScheduler, (req: Request, res: Response) => {
  res.json({
    scheduler: {
      type: 'GitHub Actions',
      enabled: true,
      schedule: [
        '8:00 AM Chilean Time (Mon-Fri)',
        '11:00 AM Chilean Time (Mon-Fri)',
        '1:00 PM Chilean Time (Mon-Fri)',
        '4:00 PM Chilean Time (Mon-Fri)'
      ],
      timezone: 'America/Santiago',
      next_execution: 'Check GitHub Actions tab in repository'
    },
    api: {
      status: 'ready',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    },
    authentication: {
      required: process.env.NODE_ENV === 'production',
      method: 'Bearer token'
    }
  });
});

// Test endpoint (development only) to verify authentication
router.post('/test', authenticateScheduler, (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ 
      error: 'Test endpoint is not available in production environment' 
    });
    return;
  }

  res.json({ 
    message: 'Authentication successful!',
    timestamp: new Date().toISOString(),
    isScheduler: (req as any).isScheduler,
    environment: process.env.NODE_ENV
  });
});

export default router;