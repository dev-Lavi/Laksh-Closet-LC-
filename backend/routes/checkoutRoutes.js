import express from 'express';
import { initiateCheckout } from '../controllers/checkoutController.js';
import { verifyOtp } from '../controllers/verifyOtp.js';

const router = express.Router();

router.post('/initiate', initiateCheckout);
router.post('/verify-otp', verifyOtp);

export default router;
