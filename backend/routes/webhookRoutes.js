// webhookRouter.js
import express from 'express';
import { handleCashfreeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Use standard JSON parser instead of raw body
router.post('/', express.json(), handleCashfreeWebhook);

export default router;