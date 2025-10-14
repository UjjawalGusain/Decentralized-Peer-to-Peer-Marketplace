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
        city: { type: String, default: '' },
        country: { type: String, default: '' },
      },
      reputation: {
        score: { type: Number, default: 0 },
        totalTransactions: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`,
        },
        required: false,
      },
    },
    fund_account_id: { type: String },
    fund_account_active: { type: Boolean, default: false },
    fund_contact_id: { type: String, unique: true },
    upi: {type: String, unique: true},
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
