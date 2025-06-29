import Otp from '../models/Otp.js';
import Order from '../models/Order.js';
import validator from 'validator';

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, orderId } = req.body;

    // Validate input
    if (!email || !otp || !orderId) {
      return res.status(400).json({ message: 'Email, OTP, and Order ID are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const existingOtp = await Otp.findOne({ email });
    if (!existingOtp) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    // Check OTP match
    if (existingOtp.otp !== otp) {
      return res.status(401).json({ message: 'Incorrect OTP' });
    }

    // Optional: Check OTP expiry (5 mins)
    const now = Date.now();
    const otpAge = now - new Date(existingOtp.createdAt).getTime();
    if (otpAge > 5 * 60 * 1000) {
      return res.status(410).json({ message: 'OTP expired. Please try again.' });
    }

    // Fetch the order and mark OTP as verified
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order: mark OTP verified
    order.isOtpVerified = true;

    // If COD: treat as paid + prevent TTL deletion
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
      order.deliveryStatus = 'processing';
      order.verifiedAt = new Date();
      order.expiresAt = undefined; // 👈 Prevent TTL deletion
    }

    await order.save();

    res.status(200).json({ message: 'OTP verified successfully', orderId: order._id });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
