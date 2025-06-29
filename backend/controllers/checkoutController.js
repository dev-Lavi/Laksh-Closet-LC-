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
      html: `<body style="font-family: 'Karla', sans-serif; line-height: 1.6; color: #333; background-color: #fafafa; margin: 0; padding: 0;">
  <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #CDB4DB, #FFC8DD); color: #fff; padding: 20px; text-align: center;">
      <img src="https://res.cloudinary.com/dqur1pzx4/image/upload/v1751192795/logo_k7eod4.png" alt="Laksh Closet Logo" style="height: 70px; width: auto; margin-bottom: 10px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Laksh Closet</h1>
      <p style="margin: 0; font-size: 14px;">Elevate Your Everyday Style</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 30px;">
      <h2 style="color: #444; margin-top: 0;">Hey there, Fashion Lover! 👗</h2>
      <p>Thank you for shopping with <strong>Laksh Closet</strong>. To verify your email address and proceed with checkout, please use the OTP below:</p>

      <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h1 style="margin: 0; font-size: 36px; color: #C06C84;">${otpCode}</h1>
      </div>

      <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you didn’t request this, just ignore the email — no worries.</p>
      <p>Stay stylish,<br><strong>Team Laksh Closet</strong></p>
    </div>

    <!-- Footer -->
    <div style="background-color:rgb(186, 220, 250); color: #333; text-align: center; padding: 20px; font-size: 14px;">
      <p><strong>Laksh Closet</strong><br>Timeless fashion, doorstep delivery.</p>
    </div>

  </div>
</body>
`
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
