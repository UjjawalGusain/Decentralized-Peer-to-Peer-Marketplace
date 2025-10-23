import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { ChatEventEnum } from "../constants";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { token, user } = useAuth();
    const socket = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);

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

        // global message listener
        socket.current.on(
            ChatEventEnum.MESSAGE_RECEIVED_EVENT,
            (newMessage) => {
                if ((newMessage.sender?._id || newMessage.sender) !== user.id) {
                    notificationSound.current.play().catch(() => {});
                }
            }
        );

        return () => {
            socket.current.disconnect();
        };
    }, [token, user.id]);

    return (
        <SocketContext.Provider
            value={{ socket: socket.current, socketConnected }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
