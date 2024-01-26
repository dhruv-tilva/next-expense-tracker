import { create } from "zustand";

const useAuthStore = create((set) => ({
  authUser: null,
  loading: false,

  setLoading: (boolean) => set(() => ({ loading: boolean })),
  setAuth: (data) => set(() => ({ authUser: data })),
}));

export default useAuthStore;
