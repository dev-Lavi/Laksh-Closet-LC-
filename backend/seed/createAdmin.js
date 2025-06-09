import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const existingAdmin = await User.findOne({ email: 'lakshcloset@gmail.com' });

  if (existingAdmin) {
    console.log('❌ Admin already exists');
  } else {
    const admin = new User({
      name: 'Admin1',
      email: 'lakshcloset@gmail.com',
      password: 'admin321', // 👈 plain text here
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
