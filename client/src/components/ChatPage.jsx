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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (!user)
    return (
      <ErrorPage message="Sorry you have not logged in so you don't have access to this page." />
    );

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 rounded-tr-3xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#FEC010] text-slate-900 font-semibold text-lg flex justify-between items-center rounded-tr-3xl">
          <span>Messages</span>
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {chats.map((c) => (
            <li
              key={c._id}
              onClick={() => {
                setSelectedChat(c);
                setSidebarOpen(false); // Close sidebar on mobile after selecting chat
              }}
              className={`p-3 sm:p-4 cursor-pointer transition-all border-b border-gray-100 
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
      <div className="flex-1 flex flex-col bg-white shadow-md rounded-3xl m-0 md:m-6 ml-0 md:ml-0">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center p-3 bg-[#FEC010]">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="ml-4 font-semibold text-slate-900">Messages</span>
        </div>

        {selectedChat ? (
          <Chat selectedChat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-base sm:text-lg px-4">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default ChatPage;
