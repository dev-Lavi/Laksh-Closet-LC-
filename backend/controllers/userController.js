import User from '../models/User.js';
import VerificationToken from '../models/VerificationToken.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// send OTP to email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save OTP in DB
  await VerificationToken.findOneAndDelete({ email }); // remove any old OTP
  await VerificationToken.create({ email, otp });

  // send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS  // app password
    }
  });

  const mailOptions = {
    from: '"Laksh Closet" <no-reply@lakshcloset.com>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};

// verify OTP and register
export const verifyAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;

  const token = await VerificationToken.findOne({ email });

  if (!token || token.otp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ name, email, password });
  await user.save();
  await VerificationToken.deleteOne({ email });

  const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'User registered successfully',
    token: authToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    }
  });
};

