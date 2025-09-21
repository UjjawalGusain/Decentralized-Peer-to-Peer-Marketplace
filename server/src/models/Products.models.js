const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ['electronics', 'clothing', 'books', 'home', 'other'],
    },
    price: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'],
      default: 'INR',
    },
    attributes: {
      type: Object,
      default: {},
    },
    images: [{ type: String }],
    videoLink: {
      type: String, // cloudinary or aws
      default: null,
    },
    inventory: { type: Number, default: 1, min: 1 },
    condition: {
      type: String,
      enum: ['new', 'used', 'refurbished', 'damaged'],
      default: 'used',
    },
    warrantyPeriod: { type: String, default: 'No warranty' },
    status: {
      type: String,
      enum: ['draft', 'active', 'sold', 'pending', 'inactive'],
      default: 'active',
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
      address: String,
      city: String,
      country: String,
    },
    tags: [String],
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
