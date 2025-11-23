import { create } from "zustand";

interface JournalState {
  currentJournalId: string;
  diaryDate: Date;
  
  refetchJournals: () => Promise<void>; 
  
  setCurrentJournalId: (currentJournalId: string) => void;
  setDiaryDate: (diaryDate: Date) => void;
  setRefetchJournals: (fn: () => Promise<void>) => void; 
}

export const useJournalStore = create<JournalState>((set) => ({
  // DONE: 초기값 지우기! - grammar feedback page -> suggestion page로 이동하려고 넣어둠
  currentJournalId: "",
  diaryDate: new Date(),
  
  refetchJournals: async () => {}, 

  setCurrentJournalId: (currentJournalId: string) => set({ currentJournalId }),
  setDiaryDate: (diaryDate: Date) => set({ diaryDate }),
  
  setRefetchJournals: (fn: () => Promise<void>) => set({ refetchJournals: fn }),
}));