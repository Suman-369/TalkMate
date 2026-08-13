import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatMobileBar from "../components/chat/ChatMobileBar.jsx";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import CreateChatModal from "../components/chat/CreateChatModal.jsx";
import { logout } from "../store/authSlice";
import {
  setChats,
  addChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setLoading,
} from "../store/chatSlice.js";
import { chatAPI, authAPI } from "../services/api";
import "../components/chat/ChatLayout.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const input = useSelector((state) => state.chat.input);
  const isSending = useSelector((state) => state.chat.isSending);
  const loading = useSelector((state) => state.chat.loading);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeChat = chats.find((c) => c._id === activeChatId) || null;

  // Load chats on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        dispatch(setLoading(true));
        const response = await chatAPI.getChats();
        dispatch(setChats(response.data.chats || []));
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadChats();
  }, [dispatch]);

  // Socket connection
  useEffect(() => {
    // Use relative path for dev, full URL for production
    const socketURL = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL || "https://chat-app-u7gk.onrender.com"
      : window.location.origin;

    const tempSocket = io(socketURL, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      path: "/socket.io/",
    });

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received AI response:", messagePayload);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          content: messagePayload.content,
        },
      ]);
      dispatch(sendingFinished());
    });

    tempSocket.on("connect", () => {
      console.log("Socket connected");
    });

    tempSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    tempSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(tempSocket);

    return () => {
      tempSocket.disconnect();
    };
  }, [dispatch]);

  const loadMessages = useCallback(async (chatId) => {
    try {
      const response = await chatAPI.getMessages(chatId);
      setMessages(
        response.data.messages.map((m) => ({
          type: m.role === "user" ? "user" : "ai",
          content: m.content,
        })),
      );
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  }, []);

  const handleCreateChat = async (title) => {
    try {
      const response = await chatAPI.createChat({ title });
      dispatch(addChat(response.data.chat));
      dispatch(selectChat(response.data.chat._id));
      setMessages([]);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
      alert("Failed to create chat");
    }
  };

  const handleSelectChat = (chatId) => {
    dispatch(selectChat(chatId));
    loadMessages(chatId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setShowCreateModal(true);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;

    dispatch(sendingStarted());
    const newMessages = [
      ...messages,
      {
        type: "user",
        content: trimmed,
      },
    ];

    setMessages(newMessages);
    dispatch(setInput(""));

    if (socket) {
      socket.emit("ai-message", {
        chat: activeChatId,
        content: trimmed,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onNewChat={handleNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onLogout={handleLogout}
        user={user}
      />
      <main className="chat-main" role="main">
        {chats.length === 0 && !loading ? (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Welcome</div>
            <h1>Start a Conversation</h1>
            <p>
              Create a new chat to begin. Ask anything, brainstorm ideas, or get
              explanations.
            </p>
            <button
              className="primary-btn"
              onClick={handleNewChat}
              style={{ marginTop: "20px" }}
            >
              Create New Chat
            </button>
          </div>
        ) : messages.length === 0 && activeChatId && !loading ? (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">New Chat</div>
            <h1>{activeChat?.title || "Chat"}</h1>
            <p>Start typing to begin the conversation</p>
          </div>
        ) : null}
        <ChatMessages messages={messages} isSending={isSending} />
        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <CreateChatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateChat}
      />
    </div>
  );
};

export default Home;
