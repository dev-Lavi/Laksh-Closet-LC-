import express from 'express';
import { handleCashfreeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Only '/' since it's mounted on /api/webhook/payment
router.post('/', handleCashfreeWebhook);

export default router;
