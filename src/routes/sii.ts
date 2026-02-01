import express from 'express';
import { fetchAndStore, fetchOnly, storeData, testEndpoint, getCallCount, resetCounter } from '../controllers/SII.controller.js';
import { authenticateScheduler } from '../middleware/scheduler-auth.js';

const router = express.Router();

// Test endpoint (for debugging)
router.get('/test', testEndpoint);

// Route to fetch and store SII data (protected for scheduler in production)
router.post('/fetch-and-store/:year/:month', authenticateScheduler, fetchAndStore);

// Route to only fetch SII data (no storage)
router.get('/fetch/:year/:month', fetchOnly);

// Route to store existing SII data
router.post('/store', storeData);

// Route to get API call counter information
router.get('/call-count', getCallCount);

// Route to reset API call counter (protected for scheduler)
router.post('/reset-counter', authenticateScheduler, resetCounter);

export default router;