import { create } from "zustand";
import { JournalResponse } from "../types/journal";

interface JournalState {
  currentJournal: JournalResponse;
  diaryDate: Date;

  setCurrentJournal: (currentJournal: JournalResponse) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  currentJournal: {
    journalId: "",
    userId: "",
    title: "",
    content: "",
    emoji: "",
    date: new Date(),
    submittedAt: new Date(),
  },
  diaryDate: new Date(),

  setCurrentJournal: (currentJournal: JournalResponse) => set({ currentJournal }),
  setDiaryDate: (diaryDate: Date) => set({ diaryDate }),
}));
