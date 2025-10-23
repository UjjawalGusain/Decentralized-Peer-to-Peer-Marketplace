import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import APIS from "../../api/api";
import { ChatEventEnum } from "../constants";
import { useSocket } from "../context/SocketContext";

const Chat = ({ selectedChat }) => {
  const { token, user } = useAuth();
  const { socket, socketConnected } = useSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friendSocketConnected, setFriendSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedChat?._id || !socket || !socketConnected) return;

    const friendId = selectedChat.participants.find(
      (p) => p._id !== user.id
    )?._id;

    // Join chat room
    socket.emit(ChatEventEnum.JOIN_CHAT_EVENT, selectedChat._id);

    // Friend online/offline events (chat-specific)
    const handleFriendConnect = ({ userId }) => {
      if (userId === friendId) setFriendSocketConnected(true);
    };
    const handleFriendDisconnect = ({ userId }) => {
      if (userId === friendId) setFriendSocketConnected(false);
    };

    socket.on(ChatEventEnum.FRIEND_CONNECTED_EVENT, handleFriendConnect);
    socket.on(ChatEventEnum.FRIEND_DISCONNECT_EVENT, handleFriendDisconnect);

    return () => {
      socket.off(ChatEventEnum.FRIEND_CONNECTED_EVENT, handleFriendConnect);
      socket.off(ChatEventEnum.FRIEND_DISCONNECT_EVENT, handleFriendDisconnect);
    };
  }, [selectedChat, socket, socketConnected, user.id]);

  // Load chat messages
  useEffect(() => {
    if (!selectedChat?._id || !token) return;

    axios
      .get(`${APIS.MESSAGES}/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.messages.reverse()))
      .catch((err) => console.error("Failed to load messages", err));
  }, [selectedChat, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(ChatEventEnum.SEND_MESSAGE_EVENT, {
      chatId: selectedChat._id,
      content: message,
    });

    setMessage("");
    setMessages((prev) => [
      ...prev,
      { sender: { _id: user.id }, content: message, _id: Date.now() },
    ]); // optional optimistic update
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden w-full max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-full">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b bg-[#FFF7D1] text-slate-900 font-semibold flex items-center justify-between">
        <span className="text-sm sm:text-base">
          Chat with{" "}
          <span className="text-gray-800 font-bold">
            {selectedChat.participants.find((p) => p._id !== user.id)?.profile
              .name || "Unknown"}
          </span>
        </span>
        <span
          className={`text-xs ${
            socketConnected ? "text-green-600" : "text-gray-400"
          }`}
        >
          {friendSocketConnected ? "● Online" : "● Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              (msg.sender?._id || msg.sender) === user.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[75%] px-3 sm:px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${
                (msg.sender?._id || msg.sender) === user.id
                  ? "bg-[#FEC010] text-slate-900 rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        className="p-2 sm:p-3 border-t bg-white flex items-center gap-2"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-xl px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-[#FEC010] outline-none text-gray-800"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-[#FEC010] text-slate-900 font-semibold rounded-r-xl hover:bg-yellow-400 transition-colors text-sm sm:text-base"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
