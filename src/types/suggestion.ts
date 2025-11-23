import { JournalSuggestionResponse } from "./journal";

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
  journal: JournalSuggestionResponse;
  createdAt: string;
}

export interface Suggestion {
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
  journal: string;
  createdAt: string;
}