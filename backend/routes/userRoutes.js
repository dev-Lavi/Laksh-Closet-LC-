import express from 'express';
import { sendOTP, verifyAndRegister } from '../controllers/userController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/register', verifyAndRegister);

export default router;
