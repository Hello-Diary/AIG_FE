import { create } from "zustand";

interface JournalState {
  currentJournalId: string;
  diaryDate: Date;

  setCurrentJournalId: (currentJournalId: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  // DONE: 초기값 지우기! - feedbackpage -> suggestionpage로 이동하려고 넣어둠
  currentJournalId: "",
  diaryDate: new Date(),

  setCurrentJournalId: (currentJournalId: string) => set({ currentJournalId }),
  setDiaryDate: (diaryDate: Date) => set({ diaryDate }),
}));
