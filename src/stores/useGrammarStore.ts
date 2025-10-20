// import { create } from "zustand";

// interface Edit {
//   start: number;
//   end: number;
//   replace: string;
//   edit_type: string;
//   err_cat: string;
//   err_type: string;
//   err_desc: string;
// }

// interface GrammarState {
//   correction: string;
//   edits: Edit[];
//   status: number | null;
//   loading: boolean;
//   error: string | null;

//   checkGrammar: (text: string, language: string) => Promise<void>;
//   clearGrammar: () => void;
// }

// export const useGrammarStore = create<GrammarState>((set) => ({
//   correction: "",
//   edits: [],
//   status: null,
//   loading: false,
//   error: null,

//   checkGrammar: async (text, language) => {
//     set({ loading: true });
//     try {
//       const res = await fetch("/api/grammar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text,
//           api_key: process.env.NEXT_PUBLIC_GRAMMAR_KEY,
//           language,
//         }),
//       });
//       const data = await res.json();
//       set({
//         correction: data.correction,
//         edits: data.edits,
//         status: data.status,
//         loading: false,
//       });
//     } catch {
//       set({ error: "Failed to check grammar", loading: false });
//     }
//   },

//   clearGrammar: () => set({ correction: "", edits: [], status: null }),
// }));
