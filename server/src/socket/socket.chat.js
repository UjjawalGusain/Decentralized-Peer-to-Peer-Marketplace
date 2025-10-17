const jwt = require('jsonwebtoken');
const User = require('./../models/Users.models')
const ChatMessage = require('./../models/Messages.model')

const initializeSocketIO = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    const token = socket.handshake.auth?.token;
    if (!token) {
      return socket.disconnect(true);
    }

    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded._id).select('-password');
      if (!user) return socket.disconnect(true);
      socket.user = user;
      socket.join(user._id.toString()); 
    } catch (err) {
      return socket.disconnect(true);
    }

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${user._id} joined room ${userId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { receiverId, message } = data;
      if (!receiverId || !message) return;

      const chatMessage = await ChatMessage.create({
        sender: socket.user._id,
        receiver: receiverId,
        message,
      });

      io.to(receiverId).emit('receiveMessage', chatMessage);
      socket.emit('receiveMessage', chatMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user?._id);
    });
  });

  return io;
};

const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

module.exports = { initializeSocketIO, emitSocketEvent };
