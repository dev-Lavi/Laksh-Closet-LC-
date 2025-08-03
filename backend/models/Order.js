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

  trackingId: {
    type: String,
    default: null,
  },

  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  otpGeneratedAt: Date,
  // expiresAt: Date, // TTL if needed

  totalAmount: Number,
  tax: Number,
  codFee: Number,

  // ✅ Fields for Cashfree Payment Gateway
  cfOrderId: {
    type: String,
    index: true, // 🔍 Makes queries faster in webhook handler
  },
  cfPaymentSessionId: String,
  cfPaymentId: String,
});

export default mongoose.model('Order', orderSchema);
