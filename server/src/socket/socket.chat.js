const jwt = require('jsonwebtoken');
const User = require('./../models/Users.models');
const ChatMessage = require('./../models/Messages.model');
const Chat = require('./../models/Chats.model');
const { ChatEventEnum } = require('./../constants');

const initializeSocketIO = server => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  const onlineUsers = new Map();

  io.on('connection', async socket => {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect(true);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return socket.disconnect(true);

      socket.user = user;

      if (!onlineUsers.has(user._id.toString()))
        onlineUsers.set(user._id.toString(), new Set());
      onlineUsers.get(user._id.toString()).add(socket.id);

      socket.join(user._id.toString());

      const chats = await Chat.find({ participants: user._id });
      for (const chat of chats) {
        for (const participantId of chat.participants) {
          const participantIdStr = participantId.toString();
          if (participantIdStr !== user._id.toString()) {
            io.to(participantIdStr).emit(ChatEventEnum.FRIEND_CONNECTED_EVENT, {
              userId: user._id.toString(),
            });

            const isFriendOnline =
              onlineUsers.has(participantIdStr) &&
              onlineUsers.get(participantIdStr).size > 0;
            socket.emit('friend-online-status', {
              userId: participantIdStr,
              online: isFriendOnline,
            });
          }
        }
      }

      socket.on(ChatEventEnum.JOIN_CHAT_EVENT, async chatId => {
        socket.join(chatId);
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const friend = chat.participants.find(
          p => p.toString() !== user._id.toString()
        );
        if (friend) {
          const isFriendOnline =
            onlineUsers.has(friend.toString()) &&
            onlineUsers.get(friend.toString()).size > 0;
          socket.emit('friend-online-status', {
            userId: friend.toString(),
            online: isFriendOnline,
          });
        }
      });

      socket.on(
        ChatEventEnum.SEND_MESSAGE_EVENT,
        async ({ chatId, content }) => {
          if (!chatId || !content) return;
          const chat = await Chat.findById(chatId);
          if (!chat) return;

          const message = await ChatMessage.create({
            sender: user._id,
            content,
            chat: chat._id,
          });

          chat.lastMessage = message._id;
          await chat.save();

          chat.participants.forEach(p =>
            io
              .to(p.toString())
              .emit(ChatEventEnum.MESSAGE_RECEIVED_EVENT, message)
          );
        }
      );

      socket.on('disconnect', async () => {
        const userSockets = onlineUsers.get(user._id.toString());
        if (userSockets) {
          userSockets.delete(socket.id);

          if (userSockets.size === 0) {
            onlineUsers.delete(user._id.toString());

            const chats = await Chat.find({ participants: user._id });
            for (const chat of chats) {
              for (const participantId of chat.participants) {
                if (participantId.toString() !== user._id.toString()) {
                  io.to(participantId.toString()).emit(
                    ChatEventEnum.FRIEND_DISCONNECT_EVENT,
                    {
                      userId: user._id.toString(),
                    }
                  );
                  io.to(participantId.toString()).emit('friend-online-status', {
                    userId: user._id.toString(),
                    online: false,
                  });
                }
              }
            }
          }
        }
      });
    } catch (err) {
      console.error('Socket authentication failed:', err);
      socket.disconnect(true);
    }
  });

  return io;
};

module.exports = { initializeSocketIO };
