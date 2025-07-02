// controllers/paymentWebhook.js
import crypto from 'crypto';
import Order from '../models/Order.js';

export const cashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const payload = JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
      .update(payload)
      .digest('base64');

    if (signature !== expected) {
      return res.status(401).send('Invalid signature');
    }

    const { event, data } = req.body;

    if (event === 'PAYMENT_SUCCESS') {
      const orderId = data.order.order_id;
      const paymentId = data.payment.payment_id;

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send('Order not found');

      order.paymentStatus = 'paid';
      order.deliveryStatus = 'processing';
      order.cfPaymentId = paymentId;
      order.verifiedAt = new Date();
      order.expiresAt = undefined; // prevent TTL deletion
      await order.save();
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).send('Webhook failed');
  }
};
