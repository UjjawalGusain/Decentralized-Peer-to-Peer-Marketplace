const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String }, 
  razorpaySignature: { type: String }, // for webhook verification (optional)
  amount: { type: Number, required: true }, // amount in paise
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], 
    default: 'created' 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
