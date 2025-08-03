// webhookController.js
import Order from '../models/Order.js';

export const handleCashfreeWebhook = async (req, res) => {
  try {
    console.log('📥 Webhook received from Cashfree');
    
    // Directly use parsed JSON body
    const payload = req.body;
    console.log('Webhook payload:', payload);

    // Handle TEST webhook
    if (payload.type === 'WEBHOOK' && payload.data?.test_object) {
      console.log('✅ Test webhook received successfully');
      return res.status(200).json({ message: 'Test webhook received' });
    }

    // Handle PAYMENT webhook
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

    // Update order
    const order = await Order.findOne({ cfOrderId });
    if (!order) {
      console.warn(`⚠️ Order not found: ${cfOrderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

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