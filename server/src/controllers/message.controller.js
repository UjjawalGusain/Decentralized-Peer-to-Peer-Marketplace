const ChatMessage = require('./../models/Messages.model');
const Chat = require('./../models/Chats.model');
const { emitSocketEvent } = require('./../socket/socket.chat');
import mongoose from 'mongoose';
import { ChatEventEnum } from '../constants';

const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'sender',
        as: 'sender',
        pipeline: [
          {
            $project: {
              'profile.name': 1,
              avatar: 1,
              'profile.email': 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: '$sender' },
      },
    },
  ];
};

class MessageController {
  sendMessageController = async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
      // && !req.files?.attachments?.length -> when attachment added
      return res.status(400).json({ error: 'Message content is required' });
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
      return res.status(404).json({ error: 'Chat does not exist' });
    }

    const message = await ChatMessage.create({
      sender: req.user._id,
      content: content,
      chat: new mongoose.Types.ObjectId(chatId),
      // add attachments in future
    });

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: message._id,
        },
      },
      { new: true }
    );

    const messages = await ChatMessage.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(message._id),
        },
      },
      ...chatMessageCommonAggregation(),
    ]);

    const receivedMessage = messages[0];

    if (!receivedMessage) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    chat.participants.forEach(participantObjectId => {
      if (participantObjectId.toString() === req.user._id.toString()) return; // that's the sender

      emitSocketEvent(
        req,
        participantObjectId.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        receivedMessage
      );
    });

    return res.json({
      message: 'Message saved successfully',
      receivedMessage,
    });
  };

  getAllMessages = async (req, res) => {
    const { chatId } = req.params;

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
      return res.status(404).json({ error: 'Chat does not exist' });
    }

    if (!selectedChat.participants?.includes(req.user?._id)) {
      return res.status(400).json({ error: 'User is not a part of this chat' });
    }

    const messages = await ChatMessage.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatMessageCommonAggregation(),
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.json({
      message: 'Message fetched successfully',
      messages
    });
  };
}


module.exports = new MessageController();