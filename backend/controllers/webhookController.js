import crypto from 'crypto';
import Order from '../models/Order.js';

export const handleCashfreeWebhook = async (req, res) => {
  try {
    console.log('📥 Webhook received from Cashfree');
    const rawBody = req.body.toString(); // Raw buffer as string
    const timestamp = req.headers['x-webhook-timestamp'];
    const signature = req.headers['x-webhook-signature'];

    console.log('Raw body:', req.body.toString());
console.log('Received timestamp:', req.headers['x-webhook-timestamp']);
console.log('Received signature:', req.headers['x-webhook-signature']);

    if (!timestamp || !signature) {
      console.warn('⚠️ Missing required headers');
      return res.status(400).json({ message: 'Missing headers' });
    }

    // Step 1: Construct signed payload
    const signedPayload = timestamp + rawBody;

    // Step 2: Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('base64');

    // Step 3: Compare signatures
    if (signature !== expectedSignature) {
      console.warn('❌ Invalid webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Step 4: Parse raw JSON after verifying signature
    const parsedBody = JSON.parse(rawBody);
    const event = parsedBody.event;
    const data = parsedBody.data;

    const cfOrderId = data.order.order_id;
    const cfPaymentId = data.payment.payment_id;
    const paymentStatus = data.payment.payment_status;

    // Step 5: Lookup order using cfOrderId (not _id)
    const order = await Order.findOne({ cfOrderId });
    if (!order) {
      console.warn(`⚠️ Order not found for cfOrderId: ${cfOrderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Step 6: Update order payment status
    order.paymentStatus = paymentStatus === 'SUCCESS' ? 'paid' : 'failed';
    order.cfPaymentId = cfPaymentId;
    order.cfOrderId = cfOrderId;

    await order.save();

    console.log(`✅ Order ${cfOrderId} updated to ${order.paymentStatus}`);

    return res.status(200).json({ message: 'Webhook received successfully' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
