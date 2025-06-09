import express from 'express';
import { sendOTP, verifyAndRegister, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/register', verifyAndRegister);
router.post('/login', loginUser);

export default router;
