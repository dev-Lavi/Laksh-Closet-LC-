import express from 'express';
import { handleCashfreeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Cashfree Webhook (should not use bodyParser.json for this route directly)
router.post('/payment', express.raw({ type: 'application/json' }), handleCashfreeWebhook);

export default router;
