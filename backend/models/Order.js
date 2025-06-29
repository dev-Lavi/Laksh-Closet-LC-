import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  email: String,
  phone: String,
  firstName: String,
  lastName: String,
  city: String,
  state: String,
  address: String,
  pinCode: String,
  cart: Array,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'failed']
  },
deliveryStatus: {
  type: String,
  enum: ['pending', 'processing', 'shipped', 'delivered'], // ✅ added "processing"
  default: 'pending'
},
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otpGeneratedAt: Date,
  expiresAt: Date, // 💥 TTL Field
  totalAmount: Number,
  tax: Number,
  codFee: Number
});

// ✅ TTL Index: Delete document after expiresAt time
orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Order', orderSchema);
