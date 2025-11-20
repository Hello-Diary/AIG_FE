import { IdiomSuggestion } from "./dictionary";

export interface SuggestionResponse {
  suggestionId: string;
  journalId: string;
  suggestions: IdiomSuggestion[];
  createdAt: string;
}