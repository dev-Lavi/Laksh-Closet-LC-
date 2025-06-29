import validator from 'validator';
import nodemailer from 'nodemailer';
import Otp from '../models/Otp.js';
import Order from '../models/Order.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const initiateCheckout = async (req, res) => {
  try {
    const {
      email, phone,
      firstName, lastName,
      city, state, address, pinCode,
      cart, paymentMethod
    } = req.body;

    // 1️⃣ Validation
    if (!email || !phone || !firstName || !lastName || !city || !state || !address || !pinCode || !cart?.length) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    if (!['cod', 'prepaid'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // 2️⃣ Calculate totals (temp price logic)
    let subtotal = 0;
    for (const item of cart) {
      if (!item.productId || !item.quantity) continue;
      subtotal += 880 * item.quantity;
    }

    const codFee = paymentMethod === 'cod' ? 200 : 0;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = subtotal + codFee + tax;

    // 3️⃣ Save order with extra fields
    const newOrder = await Order.create({
      email,
      phone,
      firstName,
      lastName,
      city,
      state,
      address,
      pinCode,
      cart,
      paymentMethod,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      isOtpVerified: false,                // ✨ Track OTP
      otpGeneratedAt: new Date(),          // ✨ For expiry if needed
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // ✨ TTL logic (15 mins)
      totalAmount: total,
      tax,
      codFee
    });

    // 4️⃣ Generate and save OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 5️⃣ Send OTP to email
    await transporter.sendMail({
      from: '"Laksh Closet" <no-reply@lakshcloset.com>',
      to: email,
      subject: 'Your Checkout OTP',
      html: `<p>Your OTP is <b>${otpCode}</b>. It is valid for 5 minutes.</p>`
    });

    // 6️⃣ Respond to frontend with orderId
    res.status(200).json({
      message: 'OTP sent to email',
      orderId: newOrder._id,
      total: total
    });
  } catch (err) {
    console.error('Checkout initiation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
