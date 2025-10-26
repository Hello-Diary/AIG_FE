import { create } from "zustand";
import { JournalResponse } from "../types/journal";

interface JournalState {
  currentJournal: JournalResponse;

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

  setCurrentJournal: (currentJournal: JournalResponse) =>
    set({ currentJournal }),
}));
