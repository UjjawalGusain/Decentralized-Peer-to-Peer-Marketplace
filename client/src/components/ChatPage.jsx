import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";
import APIS from "../../api/api";
import { useAuth } from "../context/AuthContext";
import ErrorPage from "./ErrorPages/ErrorPage";

function ChatPage() {
  const { token, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get(APIS.CHATS, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setChats(res.data.content);
        if (res.data.content.length > 0 && !selectedChat) {
          setSelectedChat(res.data.content[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  const getChatName = (chat) => {
    if (!chat.participants || chat.participants.length === 0 || !user)
      return "Unknown";

    const other = chat.participants.find(
      (p) => p._id.toString() !== user.id?.toString()
    );

    return other ? other.profile?.name || "Unnamed user" : "Unknown";
  };

  if (!user) return <ErrorPage message={"Sorry you have not logged in so you don't have access to this page."}/>;

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 shadow-sm flex flex-col rounded-tr-3xl">
        <div className="p-5 border-b border-gray-100 bg-[#FEC010] text-slate-900 font-semibold text-lg rounded-tr-2xl">
          Messages
        </div>

        <ul className="flex-1 overflow-y-auto">
          {chats.map((c) => (
            <li
              key={c._id}
              onClick={() => setSelectedChat(c)}
              className={`p-4 cursor-pointer transition-all border-b border-gray-100 
                ${
                  selectedChat?._id === c._id
                    ? "bg-[#FFF7D1] font-semibold text-slate-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              {getChatName(c)}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white shadow-md rounded-l-3xl m-3 md:m-6">
        {selectedChat ? (
          <Chat selectedChat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
