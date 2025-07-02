// routes/paymentRoutes.js
import express from 'express';
import { initiateCashfreePayment } from '../controllers/initiateCashfreePayment.js';
import { cashfreeWebhook } from '../controllers/paymentWebhook.js';

const router = express.Router();

router.post('/initiate', initiateCashfreePayment);

router.post('/webhook', express.json({ type: '*/*' }), cashfreeWebhook);

export default router;
