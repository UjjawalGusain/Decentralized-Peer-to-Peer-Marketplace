import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { ChatEventEnum } from "../constants";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const notificationSound = useRef(new Audio("/notification_baby_duck.mp3"));
  const userIdRef = useRef(user?.id);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    notificationSound.current.load();
  }, []);

  useEffect(() => {
    if (!token || !user?.id) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnectionAttempts: 3,
    });
    socketRef.current = socket;

    // Connection events
    socket.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
    });

    socket.on(ChatEventEnum.DISCONNECT_EVENT, (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
    });

    // Friend online/offline events
    socket.on("friend-online-status", ({ userId, online }) => {
      console.log(`Friend ${userId} is ${online ? "online" : "offline"}`);
      setOnlineUsers((prev) => {
        if (online && !prev.includes(userId)) return [...prev, userId];
        if (!online) return prev.filter((id) => id !== userId);
        return prev;
      });
    });

    // Incoming messages
    socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (newMessage) => {
      if ((newMessage.sender?._id || newMessage.sender) !== userIdRef.current) {
        setLastMessage(newMessage);
        notificationSound.current.play().catch(() => {});
      }
    });

    // Cleanup on logout/unmount
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
        setOnlineUsers([]);
        setSocketConnected(false);
      }
    };
  }, [token, user?.id]);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        socketConnected,
        isUserOnline,
        lastMessage,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
