import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const existingAdmin = await User.findOne({ email: 'lavi2312042@akgec.ac.in' });

  if (existingAdmin) {
    console.log('❌ Admin already exists');
  } else {
    const admin = new User({
      name: 'Admin',
      email: 'lavi2312042@akgec.ac.in',
      password: 'admin123', // 👈 plain text here
      isAdmin: true
    });

    await admin.save();
    console.log('✅ Admin created successfully');
  }

  mongoose.disconnect();
}).catch((err) => {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
});
