import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  phoneNumber: "",
  isAuthLoaded: false,
  login: (phoneNumber) => {
    set({ isLoggedIn: true, phoneNumber, isAuthLoaded: true });
    localStorage.setItem(
      "auth",
      JSON.stringify({ isLoggedIn: true, phoneNumber })
    );
  },
  logout: () => {
    set({ isLoggedIn: false, phoneNumber: "", isAuthLoaded: true });
    localStorage.clear();
  },
  loadFromStorage: () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.isLoggedIn) {
      set({ ...authData, isAuthLoaded: true });
    } else {
      set({ isAuthLoaded: true });
    }
  },
  setAuthLoading: () => set({ isAuthLoaded: false }),
}));

export default useAuthStore;
