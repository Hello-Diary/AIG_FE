import { create } from "zustand";

interface JournalState {
  currentJournalId: string;
  diaryDate: Date;

  setCurrentJournalId: (currentJournalId: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  currentJournalId: "0",
  diaryDate: new Date(),

  setCurrentJournalId: (currentJournalId: string) => set({ currentJournalId }),
  setDiaryDate: (diaryDate: Date) => set({ diaryDate }),
}));
