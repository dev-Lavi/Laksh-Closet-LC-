// controllers/paymentController.js
import axios from 'axios';
import Order from '../models/Order.js';

export const initiateCashfreePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure OTP is verified before initiating payment
    if (!order.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified for this order' });
    }

    // Prepare payload for Cashfree
    const payload = {
      order_id: order._id.toString(),
      order_amount: order.totalAmount, // Ensure this field exists
      order_currency: 'INR',
      customer_details: {
        customer_id: `user_${order._id}`,
        customer_email: order.email,
        customer_name: order.name,
        customer_phone: order.phone,
      },
      order_meta: {
        return_url: `https://laksh-closet-lc.vercel.app/payment-success?order_id={order_id}`,
        notify_url: `https://cash-cue.onrender.com/api/payment/webhook`,
      },
    };

    // Send request to Cashfree
    const response = await axios.post(
      'https://api.cashfree.com/pg/orders',
      payload,
      {
        headers: {
          'x-api-version': '2022-09-01',
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const { payment_session_id } = response.data;

    // Send session ID to frontend
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
