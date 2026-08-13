import axios from "axios";

// Use relative paths for dev (proxy will redirect to backend)
// Use full URL only in production
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "https://chat-app-u7gk.onrender.com"
  : "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
};

// Chat APIs
export const chatAPI = {
  createChat: (data) => api.post("/chat", data),
  getChats: () => api.get("/chat"),
  getMessages: (chatId) => api.get(`/chat/messages/${chatId}`),
  sendMessage: (chatId, data) => api.post(`/chat/messages/${chatId}`, data),
};

export default api;
