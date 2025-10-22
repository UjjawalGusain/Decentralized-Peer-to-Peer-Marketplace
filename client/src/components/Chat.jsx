import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import APIS from "../../api/api";
import { ChatEventEnum } from "../constants";

const Chat = ({ selectedChat }) => {
    const { token, user } = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [friendSocketConnected, setFriendSocketConnected] = useState(false);

    const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const notificationSound = useRef(new Audio("/notification_baby_duck.mp3"));

    useEffect(() => {
        if (!token) return;

        socket.current = io(import.meta.env.VITE_API_URL, {
            auth: { token },
        });

        socket.current.on(ChatEventEnum.CONNECTED_EVENT, () =>
            setSocketConnected(true)
        );
        socket.current.on(ChatEventEnum.DISCONNECT_EVENT, () =>
            setSocketConnected(false)
        );

        socket.current.on(
            ChatEventEnum.MESSAGE_RECEIVED_EVENT,
            (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);

                if ((newMessage.sender?._id || newMessage.sender) !== user.id) {
                    notificationSound.current.play().catch(() => {});
                }
            }
        );

        const handleFriendConnect = ({ userId }) => {
            const friendId = selectedChat?.participants.find(
                (p) => p._id !== user.id
            )?._id;
            if (friendId === userId) setFriendSocketConnected(true);
        };

        const handleFriendDisconnect = ({ userId }) => {
            const friendId = selectedChat?.participants.find(
                (p) => p._id !== user.id
            )?._id;
            if (friendId === userId) setFriendSocketConnected(false);
        };

        socket.current.on(
            ChatEventEnum.FRIEND_CONNECTED_EVENT,
            handleFriendConnect
        );
        socket.current.on(
            ChatEventEnum.FRIEND_DISCONNECT_EVENT,
            handleFriendDisconnect
        );

        socket.current.on("friend-online-status", ({ userId, online }) => {
            const friendId = selectedChat?.participants.find(
                (p) => p._id !== user.id
            )?._id;
            if (friendId === userId) setFriendSocketConnected(online);
        });

        return () => {
            socket.current.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
            socket.current.off(
                ChatEventEnum.FRIEND_CONNECTED_EVENT,
                handleFriendConnect
            );
            socket.current.off(
                ChatEventEnum.FRIEND_DISCONNECT_EVENT,
                handleFriendDisconnect
            );
            socket.current.off("friend-online-status");
            socket.current.disconnect();
        };
    }, [token, selectedChat, user.id]);

    useEffect(() => {
        if (!selectedChat?._id || !token) return;

        axios
            .get(`${APIS.MESSAGES}/${selectedChat._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMessages(res.data.messages.reverse()))
            .catch((err) => console.error("Failed to load messages", err));
    }, [selectedChat, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!selectedChat?._id || !socket.current || !socketConnected) return;

        socket.current.emit(ChatEventEnum.JOIN_CHAT_EVENT, selectedChat._id);
    }, [selectedChat, socketConnected]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.current.emit(ChatEventEnum.SEND_MESSAGE_EVENT, {
            chatId: selectedChat._id,
            content: message,
        });

        setMessage("");
    };

    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden w-full max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-full">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b bg-[#FFF7D1] text-slate-900 font-semibold flex items-center justify-between">
                <span className="text-sm sm:text-base">
                    Chat with{" "}
                    <span className="text-gray-800 font-bold">
                        {
                            selectedChat.participants.find(
                                (p) => p._id !== user.id
                            )?.profile.name
                        }
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
