import express from 'express';
import { fetchAndStore, fetchOnly, storeData } from '../controllers/SII.controller.js';

const router = express.Router();

// Route to fetch and store SII data (protected for scheduler in production)
router.post('/fetch-and-store/:year/:month', fetchAndStore);

// Route to only fetch SII data (no storage)
router.get('/fetch/:year/:month', fetchOnly);

// Route to store existing SII data
router.post('/store', storeData);

export default router;