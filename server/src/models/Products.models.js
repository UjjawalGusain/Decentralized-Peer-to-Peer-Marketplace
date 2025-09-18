const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, required: true, enum: ['electronics', 'clothing', 'books', 'home', 'other'] },
  price: { type: Number, required: true, min: 0 },
  currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'],
      default: 'INR'
  },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['draft', 'active', 'sold', 'pending', 'inactive'],
    default: 'active'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    address: String,
    city: String,
    country: String
  },
}, {
  timestamps: true
});

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
