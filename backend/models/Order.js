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

  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      size: {
        type: String,
        required: true
      }
    }
  ],

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
  // expiresAt: Date,

  totalAmount: Number,
  tax: Number,
  codFee: Number,

  cfOrderId: {
    type: String,
    index: true,
  },
  cfPaymentSessionId: String,
  cfPaymentId: String,
});


export default mongoose.model('Order', orderSchema);
