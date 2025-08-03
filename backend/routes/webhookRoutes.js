import express from 'express';
import { handleCashfreeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Add raw body middleware specifically for this webhook route
router.post(
  '/',
  express.raw({ type: 'application/json' }), // 👈 CRITICAL ADDITION
  handleCashfreeWebhook
);

export default router;