import crypto from 'crypto';
import Order from '../models/Order.js';

export const handleCashfreeWebhook = async (req, res) => {
  try {
    // 1. Raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-cf-signature'];

    // 2. Verify signature using your Cashfree webhook secret
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.warn('⚠️ Invalid webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body.event;
    const data = req.body.data;

    // 3. Extract orderId and payment details
    const cfOrderId = data.order.order_id;
    const cfPaymentId = data.payment.payment_id;
    const paymentStatus = data.payment.payment_status;

    // 4. Find the order in MongoDB
    const order = await Order.findById(cfOrderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 5. Update order based on payment status
    if (paymentStatus === 'SUCCESS') {
      order.paymentStatus = 'paid';
      order.cfPaymentId = cfPaymentId;
      order.cfOrderId = cfOrderId;
    } else if (paymentStatus === 'FAILED') {
      order.paymentStatus = 'failed';
      order.cfPaymentId = cfPaymentId;
      order.cfOrderId = cfOrderId;
    }

    await order.save();
    console.log(`✅ Order ${cfOrderId} updated to ${order.paymentStatus}`);

    return res.status(200).json({ message: 'Webhook received successfully' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
