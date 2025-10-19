const jwt = require('jsonwebtoken');
const User = require('./../models/Users.models');
const ChatMessage = require('./../models/Messages.model');
const Chat = require('./../models/Chats.model');
const { ChatEventEnum } = require('./../constants');

const initializeSocketIO = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.on('connection', async (socket) => {
    // console.log('User connected:', socket.id);

    // Authenticate socket
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect(true);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('-password');
      if (!user) return socket.disconnect(true);

      socket.user = user;
      socket.join(user._id.toString()); // join personal room

      // Optional: join additional chat rooms
      socket.on('join', (chatId) => {
        socket.join(chatId);
        // console.log(`User ${user._id} joined chat ${chatId}`);
      });

      // Handle sending messages
      socket.on('sendMessage', async (data) => {
        const { chatId, content } = data;
        if (!chatId || !content) return;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const message = await ChatMessage.create({
          sender: socket.user._id,
          content,
          chat: chat._id,
        });

        // Update last message in chat
        chat.lastMessage = message._id;
        await chat.save();

        // Emit message to all participants
        chat.participants.forEach((p) => {
          io.to(p.toString()).emit(ChatEventEnum.MESSAGE_RECEIVED_EVENT, message);
        });
      });

      socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.user?._id);
      });
    } catch (err) {
      return socket.disconnect(true);
    }
  });

  return io;
};

// Emit event from controllers
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get('io').in(roomId).emit(event, payload);
};

module.exports = { initializeSocketIO, emitSocketEvent };
