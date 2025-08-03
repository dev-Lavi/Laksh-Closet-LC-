import crypto from 'crypto';
import Order from '../models/Order.js';

export const handleCashfreeWebhook = async (req, res) => {
  try {
    console.log('📥 Webhook received from Cashfree');
    
    // Use raw body buffer directly (requires middleware change)
    const rawBody = req.body; 
    const timestamp = req.headers['x-webhook-timestamp'];
    const signature = req.headers['x-webhook-signature'];

    console.log('Raw body:', rawBody.toString('utf8'));
    console.log('Received timestamp:', timestamp);
    console.log('Received signature:', signature);

    if (!timestamp || !signature) {
      console.warn('⚠️ Missing required headers');
      return res.status(400).json({ message: 'Missing headers' });
    }

    // Convert timestamp to milliseconds (Cashfree requirement)
    const timestampMillis = timestamp.length === 10 
      ? String(parseInt(timestamp) * 1000) 
      : timestamp;

    // Construct signed payload with millisecond timestamp
    const signedPayload = timestampMillis + rawBody.toString('utf8');

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('base64');

    // Compare signatures
    if (signature !== expectedSignature) {
      console.warn(`❌ Invalid webhook signature
        Expected: ${expectedSignature}
        Received: ${signature}`);
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Parse JSON after verification
    const payload = JSON.parse(rawBody);
    console.log('Webhook payload:', payload);

    // Handle test event
    if (payload.type === 'WEBHOOK' && payload.data?.test_object) {
      console.log('✅ Test webhook verified successfully');
      return res.status(200).json({ message: 'Test webhook received' });
    }

    // Handle payment event
    const event = payload.type;
    const data = payload.data;

    // Validate payment data structure
    if (!data?.order || !data?.payment) {
      console.warn('⚠️ Invalid payment data structure');
      return res.status(400).json({ message: 'Invalid webhook data' });
    }

    const cfOrderId = data.order.order_id;
    const cfPaymentId = data.payment.payment_id;
    const paymentStatus = data.payment.payment_status;

    // Lookup order
    const order = await Order.findOne({ cfOrderId });
    if (!order) {
      console.warn(`⚠️ Order not found for cfOrderId: ${cfOrderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order
    order.paymentStatus = paymentStatus === 'SUCCESS' ? 'paid' : 'failed';
    order.cfPaymentId = cfPaymentId;
    await order.save();

    console.log(`✅ Order ${cfOrderId} updated to ${order.paymentStatus}`);
    return res.status(200).json({ message: 'Webhook processed' });
    
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};