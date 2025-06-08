import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires in 5 min
});

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
export default VerificationToken;
