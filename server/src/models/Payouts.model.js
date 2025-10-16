const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  razorpayPayoutId: { type: String, required: true, unique: true },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  mode: { type: String, enum: ['UPI', 'NEFT', 'IMPS'], default: 'UPI' },
  status: {
    type: String,
    enum: ['created', 'processing', 'successful', 'failed'],
    default: 'created',
  },
  failureReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

payoutSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payout', payoutSchema);
