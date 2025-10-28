
export interface Edit {
  start: number;
  end: number;
  replace: string;
  editType: string;
  errCat: string;
  errType: string;
  errDesc: string;
}

export interface GrammarResponse {
  correction: string;
  status: number;
  edits: Edit[];
  latency: number;
}

export interface SuggestionResponse {
  suggestionId: string;
  front: string;
  back: string;
  idiom: string;
  origin: string;
  meaning: string;
  context: string;
  naturalExample: string;
  appliedSentence: string;
  isFlashcard: boolean;
  journalId: string;
  createdAt: Date;
}
