import express from 'express';
import { handleCashfreeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Raw body is already handled in app.js
router.post('/payment', handleCashfreeWebhook);

export default router;
