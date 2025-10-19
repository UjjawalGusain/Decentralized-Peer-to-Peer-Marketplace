import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import APIS from "../../api/api";

const Chat = ({ selectedChat }) => {
  const { token, user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    if (!token) return;
    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socket.current.on("connect", () => {
    //   console.log("Socket Connected:", socket.current.id);
      setSocketConnected(true);
    });

    socket.current.on("MESSAGE_RECEIVED_EVENT", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (selectedChat?._id && token) {
      axios
        .get(`${APIS.MESSAGES}/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessages(res.data.messages.reverse()))
        .catch((err) => console.error("Failed to load messages", err));
    }
  }, [selectedChat, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${APIS.MESSAGES_SEND}/${selectedChat._id}`,
        { content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msg = res.data.receivedMessage;
      setMessages((prev) => [...prev, msg]);

      socket.current.emit("sendMessage", {
        chatId: selectedChat._id,
        content: message,
      });

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b bg-[#FFF7D1] text-slate-900 font-semibold flex items-center justify-between">
        <span>
          Chat with{" "}
          <span className="text-gray-800 font-bold">
            {
              selectedChat.participants.find((p) => p._id !== user.id)?.profile
                .name
            }
          </span>
        </span>
        <span
          className={`text-xs ${
            socketConnected ? "text-green-600" : "text-gray-400"
          }`}
        >
          {socketConnected ? "● Online" : "● Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender?._id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                msg.sender?._id === user?.id
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
        onSubmit={sendMessage}
        className="p-3 border-t bg-white flex items-center"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2 focus:ring-2 focus:ring-[#FEC010] outline-none text-gray-800"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#FEC010] text-slate-900 font-semibold rounded-r-xl hover:bg-yellow-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
