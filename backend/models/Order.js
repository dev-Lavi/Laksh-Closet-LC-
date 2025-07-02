import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  email: String,
  phone: String,
  firstName: String,
  lastName: String,
  customerName: String,
  city: String,
  state: String,
  address: String,
  pinCode: String,
  cart: Array,

  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'failed'],
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,

  otpGeneratedAt: Date,
  expiresAt: Date, // TTL

  totalAmount: Number,
  tax: Number,
  codFee: Number,

  // Optional fields for Cashfree tracking
  cfOrderId: String,
  cfPaymentSessionId: String,
  cfPaymentId: String,
});

// TTL index
orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Order', orderSchema);
