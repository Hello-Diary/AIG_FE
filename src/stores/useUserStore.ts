import { create } from 'zustand';

type UserState = {
  userId: string;
  email: string;
  name: string;
  profileKeyword: string;
  createdAt: Date;

  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setProfileKeyword: (profileKeyword: string) => void;
  setCreatedAt: (createdAt: Date) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: '',
  email: '',
  name: '',
  profileKeyword: '',
  createdAt: new Date(),

  setUserId: (userId: string) => set({ userId }),
  setEmail: (email: string) => set({ email }),
  setName: (name: string) => set({ name }),
  setProfileKeyword: (profileKeyword: string) => set({profileKeyword}),
  setCreatedAt: (createdAt: Date) => set({ createdAt }),
}));