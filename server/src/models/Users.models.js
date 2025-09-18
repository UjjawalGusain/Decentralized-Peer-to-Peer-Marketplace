const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    profile: {
      name: { type: String, required: true },
      avatar: { type: String },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
      reputation: {
        score: { type: Number, default: 0 },
        totalTransactions: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
      },
    },
    roles: {
      type: [String],
      enum: ['buyer', 'seller'],
      default: ['buyer'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
