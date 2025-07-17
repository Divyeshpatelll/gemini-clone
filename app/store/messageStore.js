import { create } from "zustand";

const useMessageStore = create((set, get) => ({
  messages: {},

  sendMessage: (roomId, msg) => {
    const roomMessages = get().messages[roomId] || [];
    const newMessages = [...roomMessages, msg];
    const updated = {
      ...get().messages,
      [roomId]: newMessages,
    };
    localStorage.setItem("messages", JSON.stringify(updated));
    set({ messages: updated });
  },

  loadMessages: () => {
    const saved = JSON.parse(localStorage.getItem("messages")) || {};
    set({ messages: saved });
  },
}));

export default useMessageStore;
