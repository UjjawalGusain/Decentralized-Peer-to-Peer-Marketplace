import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { ChatEventEnum } from "../constants";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socket = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); // all currently online users
  const [lastMessage, setLastMessage] = useState(null);


  const notificationSound = useRef(new Audio("/notification_baby_duck.mp3"));
  const userIdRef = useRef(user?.id);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    if (!token) return;

    // Connect socket globally
    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    // Connection events
    socket.current.on(ChatEventEnum.CONNECTED_EVENT, () => setSocketConnected(true));
    socket.current.on(ChatEventEnum.DISCONNECT_EVENT, () => setSocketConnected(false));

    // Global message notifications
    socket.current.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (newMessage) => {
      if ((newMessage.sender?._id || newMessage.sender) !== userIdRef.current) {
        // console.log("Here");
        setLastMessage(newMessage);
        
        notificationSound.current.play().catch(() => {});
      }
    });

    // Track online users globally
    socket.current.on("friend-online-status", ({ userId, online }) => {
      setOnlineUsers((prev) => {
        if (online && !prev.includes(userId)) return [...prev, userId];
        if (!online) return prev.filter((id) => id !== userId);
        
        return prev;
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);

  // Helper to check if a specific friend is online
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider value={{ socket: socket.current, socketConnected, isUserOnline, lastMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
