import { createSlice, nanoid } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null,
    isSending: false,
    input: "",
    loading: false,
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
      if (state.chats.length > 0 && !state.activeChatId) {
        state.activeChatId = state.chats[0]._id;
      }
    },
    addChat(state, action) {
      state.chats.unshift(action.payload);
      state.activeChatId = action.payload._id;
    },
    selectChat(state, action) {
      state.activeChatId = action.payload;
    },
    setInput(state, action) {
      state.input = action.payload;
    },
    sendingStarted(state) {
      state.isSending = true;
    },
    sendingFinished(state) {
      state.isSending = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    addUserMessage: {
      reducer(state, action) {
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c._id === chatId);
        if (!chat) return;
        chat.messages.push(message);
      },
      prepare(chatId, content) {
        return {
          payload: {
            chatId,
            message: { id: nanoid(), role: "user", content, ts: Date.now() },
          },
        };
      },
    },
    addAIMessage: {
      reducer(state, action) {
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c._id === chatId);
        if (!chat) return;
        chat.messages.push(message);
      },
      prepare(chatId, content, error = false) {
        return {
          payload: {
            chatId,
            message: {
              id: nanoid(),
              role: "ai",
              content,
              ts: Date.now(),
              ...(error ? { error: true } : {}),
            },
          },
        };
      },
    },
  },
});

export const {
  setChats,
  addChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setLoading,
  addUserMessage,
  addAIMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
