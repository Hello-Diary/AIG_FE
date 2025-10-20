// import { create } from "zustand";

// interface Suggestion {
//   suggestionId: string;
//   front: string;
//   back: string;
//   idiom: string;
//   origin: string;
//   meaning: string;
//   context: string;
//   naturalExample: string;
//   appliedSentence: string;
//   isFlashcard: boolean;
// }

// interface SuggestionState {
//   suggestions: Suggestion[];
//   loading: boolean;
//   error: string | null;

//   fetchSuggestionsByJournal: (journalId: string) => Promise<void>;
//   toggleFlashcard: (suggestionId: string, current: boolean) => Promise<void>;
//   deleteSuggestion: (suggestionId: string) => Promise<void>;
// }

// export const useSuggestionStore = create<SuggestionState>((set) => ({
//   suggestions: [],
//   loading: false,
//   error: null,

//   fetchSuggestionsByJournal: async (journalId) => {
//     set({ loading: true });
//     try {
//       const res = await fetch(`/api/suggestions/journal/${journalId}`);
//       const data = await res.json();
//       set({ suggestions: data, loading: false });
//     } catch {
//       set({ error: "Failed to fetch suggestions", loading: false });
//     }
//   },

//   toggleFlashcard: async (suggestionId, current) => {
//     try {
//       await fetch(`/api/suggestions/${suggestionId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isFlashcard: !current }),
//       });
//       set((state) => ({
//         suggestions: state.suggestions.map((s) =>
//           s.suggestionId === suggestionId ? { ...s, isFlashcard: !current } : s
//         ),
//       }));
//     } catch {
//       set({ error: "Failed to toggle flashcard" });
//     }
//   },

//   deleteSuggestion: async (suggestionId) => {
//     try {
//       await fetch(`/api/suggestions/${suggestionId}`, { method: "DELETE" });
//       set((state) => ({
//         suggestions: state.suggestions.filter((s) => s.suggestionId !== suggestionId),
//       }));
//     } catch {
//       set({ error: "Failed to delete suggestion" });
//     }
//   },
// }));
