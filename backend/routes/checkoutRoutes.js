import express from 'express';
import { initiateCheckout } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/initiate', initiateCheckout);

export default router;
