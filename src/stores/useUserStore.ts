import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserProfile {
  userId: string;
  name: string;
  email: string | null;
  profileKeyword: string | null;
  createdAt?: Date | null;
}

type UserState = {
  userId: string | null;
  email: string | null;
  name: string | null;
  profileKeyword: string | null;
  createdAt: Date | null;

  signIn: (profile: UserProfile) => void;
  signOut: () => void;
};

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      name: null,
      profileKeyword: null,
      createdAt: null,

      signIn: (profile) => {
        set({
          userId: profile.userId,
          name: profile.name,
          email: profile.email,
          profileKeyword: profile.profileKeyword,
          createdAt: profile.createdAt ?? null,
        });
      },
      signOut: () =>
        set({
          userId: null,
          email: null,
          name: null,
          profileKeyword: null,
          createdAt: null,
        }),
    }),
    {
      name: "auth-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
