import { create } from "zustand";

const useChatStore = create((set, get) => ({
  chatrooms: [],
  addChatroom: (title) => {
    const newRoom = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().chatrooms, newRoom];
    localStorage.setItem("chatrooms", JSON.stringify(updated));
    set({ chatrooms: updated });
    return newRoom.id;
  },
  deleteChatroom: (id) =>
    set((state) => {
      const updated = state.chatrooms.filter((c) => c.id !== id);
      localStorage.setItem("chatrooms", JSON.stringify(updated));
      return { chatrooms: updated };
    }),
  loadChatrooms: () => {
    const saved = JSON.parse(localStorage.getItem("chatrooms")) || [];
    set({ chatrooms: saved });
  },
  getChatroomById: (id) => {
    return get().chatrooms.find((c) => c.id === id);
  },
}));

export default useChatStore;
