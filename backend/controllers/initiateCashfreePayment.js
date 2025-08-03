import axios from 'axios';
import Order from '../models/Order.js';

export const initiateCashfreePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId in request body' });
    }

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure OTP is verified before initiating payment
    if (!order.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified for this order' });
    }

    // Prepare payload for Cashfree 2023
    const cfOrderId = `CF_${order._id.toString()}`; // Optional: prefix for tracking
    const payload = {
      order_id: cfOrderId,
      order_amount: order.totalAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `user_${order._id}`,
        customer_email: order.email,
        customer_name: order.customerName, // FIXED
        customer_phone: order.phone,
      },
      order_meta: {
        return_url: `https://laksh-closet-lc.vercel.app/order-success`,
        notify_url: `https://laksh-closet.onrender.com/api/webhook/payment`,
      },
    };

    // Cashfree request
    const response = await axios.post(
      'https://api.cashfree.com/pg/orders',
      payload,
      {
        headers: {
          'x-api-version': '2023-08-01', // ✅ Use latest version
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const { payment_session_id } = response.data;

    if (!payment_session_id) {
      return res.status(500).json({ message: 'Payment session not created' });
    }

    // ✅ Save to DB
    order.cfOrderId = cfOrderId;
    order.cfPaymentSessionId = payment_session_id;
    await order.save();

    // ✅ Respond
    res.status(200).json({
      payment_session_id,
      orderId: order._id,
    });

  } catch (err) {
    console.error('Cashfree initiation error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to initiate payment',
      error: err.response?.data || err.message,
    });
  }
};
