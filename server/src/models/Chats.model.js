import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', chatSchema);