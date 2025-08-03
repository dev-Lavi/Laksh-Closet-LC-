// routes/paymentRoutes.js
import express from 'express';
import { initiateCashfreePayment } from '../controllers/initiateCashfreePayment.js';

const router = express.Router();

router.post('/initiate', initiateCashfreePayment);


export default router;
