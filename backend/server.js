import express from 'express'; 
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());

// 🟡 Webhook route needs to come BEFORE express.json
app.use('/api/webhook/payment', webhookRoutes);

// After webhook raw body
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Other API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Self-ping for Render
setInterval(() => {
  const url = `${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}/ping`;
  fetch(url)
    .then(() => console.log('📡 Self-ping sent'))
    .catch((err) => console.error('⚠️ Self-ping failed:', err.message));
}, 14 * 60 * 1000);
