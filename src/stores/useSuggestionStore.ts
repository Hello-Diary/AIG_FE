import { create } from "zustand";

interface SuggestionState {
  isSuggested: boolean;

  setIsSuggested: (isSuggested: boolean) => void;
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
  isSuggested: false,

  setIsSuggested: (isSuggested: boolean) => set({ isSuggested }),
}));
