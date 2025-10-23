
interface JournalState {
  currentJournalId: string | null;

  setCurrentJournalId: (currentJournalId: string) => void;
  clearCurrentJournal: () => void;
}

// export const useJournalStore = create<JournalState>((set) => ({
//   journals: [],
//   currentJournal: null,
//   loading: false,
//   error: null,

// }));
