// import { JournalRequest, JournalResponse } from "@/src/types/journal";
// import { create } from "zustand";

// interface JournalState {
//   journals: JournalResponse[];
//   currentJournal: JournalResponse | null;
//   loading: boolean;
//   error: string | null;

//   fetchUserJournals: (userId: string) => Promise<void>;
//   fetchJournalById: (journalId: string, userId: string) => Promise<void>;
//   createJournal: (userId: string, data: JournalRequest) => Promise<void>;
//   updateJournal: (journalId: string, userId: string, data: JournalRequest) => Promise<void>;
//   clearCurrentJournal: () => void;
// }

// export const useJournalStore = create<JournalState>((set) => ({
//   journals: [],
//   currentJournal: null,
//   loading: false,
//   error: null,

//   fetchUserJournals: async (userId) => {
//     set({ loading: true });
//     try {
//       const res = await fetch(`/api/journals/user/${userId}`);
//       const data = await res.json();
//       set({ journals: data, loading: false });
//     } catch (e) {
//       set({ error: "Failed to load journals", loading: false });
//     }
//   },

//   fetchJournalById: async (journalId, userId) => {
//     set({ loading: true });
//     try {
//       const res = await fetch(`/api/journals/${journalId}?userId=${userId}`);
//       const data = await res.json();
//       set({ currentJournal: data, loading: false });
//     } catch (e) {
//       set({ error: "Failed to load journal", loading: false });
//     }
//   },

//   createJournal: async (userId, data) => {
//     set({ loading: true });
//     try {
//       await fetch(`/api/journals?userId=${userId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       set({ loading: false });
//     } catch {
//       set({ error: "Failed to create journal", loading: false });
//     }
//   },

//   updateJournal: async (journalId, userId, data) => {
//     set({ loading: true });
//     try {
//       await fetch(`/api/journals/${journalId}?userId=${userId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       set({ loading: false });
//     } catch {
//       set({ error: "Failed to update journal", loading: false });
//     }
//   },

//   clearCurrentJournal: () => set({ currentJournal: null }),
// }));
