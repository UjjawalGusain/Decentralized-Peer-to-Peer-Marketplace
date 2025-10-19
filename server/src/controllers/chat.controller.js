const mongoose = require('mongoose');
const Chat = require('../models/Chats.model');
const User = require('../models/Users.models');
const { emitSocketEvent } = require('../socket/socket.chat');
const { ChatEventEnum } = require('../constants');

const chatCommonAggregation = () => [
  {
    $lookup: {
      from: 'users',
      localField: 'participants',
      foreignField: '_id',
      as: 'participants',
      pipeline: [
        {
          $project: {
            'profile.name': 1,
            'profile.avatar': 1,
            'profile.email': 1,
            _id: 1,
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: 'chatmessages',
      localField: 'lastMessage',
      foreignField: '_id',
      as: 'lastMessage',
      pipeline: [
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
            pipeline: [
              {
                $project: {
                  'profile.name': 1,
                  'profile.avatar': 1,
                  _id: 1,
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
      ],
    },
  },
  {
    $addFields: {
      lastMessage: { $first: '$lastMessage' },
    },
  },
];

class ChatController {
  createChat = async (req, res) => {
    try {
      const { receiverId } = req.params;

      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ error: 'Receiver does not exist' });
      }

    //   console.log(`receiver._id: ${receiver._id}`);
    //   console.log(req.user);
      

      if (receiver._id.toString() === req.user.userId.toString()) {
        return res.status(400).json({ error: 'You cannot chat with yourself' });
      }

      const chat = await Chat.aggregate([
        {
          $match: {
            $and: [
              { participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(req.user.userId) } } },
              {
                participants: {
                  $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
                },
              },
            ],
          },
        },
        ...chatCommonAggregation(),
      ]);

      if (chat.length) {
        return res.json({
          message: 'Chat retrieved successfully',
          content: chat[0],
        });
      }

      const newChatInstance = await Chat.create({
        name: 'One on one chat',
        participants: [req.user.userId, new mongoose.Types.ObjectId(receiverId)],
      });

      const createdChat = await Chat.aggregate([
        { $match: { _id: newChatInstance._id } },
        ...chatCommonAggregation(),
      ]);

      const payload = createdChat[0];

      if (!payload) {
        return res.status(500).json({ error: 'Internal server error' });
      }


      payload?.participants?.forEach((participant) => {
        if (participant._id.toString() === req.user.userId.toString()) return;

        emitSocketEvent(
          req,
          participant._id.toString(),
          ChatEventEnum.NEW_CHAT_EVENT,
          payload
        );
      });


      return res.json({
        message: 'Chat created successfully',
        content: payload,
      });
    } catch (error) {
      console.error('Error in createChat:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  getAllChats = async (req, res) => {
    try {
        

      const chats = await Chat.aggregate([
        { $match: { participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(req.user.userId) } } } },
        { $sort: { updatedAt: -1 } },
        ...chatCommonAggregation(),
      ]);

      return res.status(200).json({
        message: 'User chats retrieved successfully',
        content: chats,
      });
    } catch (error) {
      console.error('Error in getAllChats:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
}

module.exports = new ChatController();
