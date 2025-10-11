import { create } from "zustand";

type UserState = {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;

  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setRole: (role: string) => void;
  setCreatedAt: (createdAt: Date) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: "",
  email: "",
  name: "",
  role: "",
  createdAt: new Date(),

  setUserId: (userId: string) => set({ userId }),
  setEmail: (email: string) => set({ email }),
  setName: (name: string) => set({ name }),
  setRole: (role: string) => set({ role }),
  setCreatedAt: (createdAt: Date) => set({ createdAt }),
}));
