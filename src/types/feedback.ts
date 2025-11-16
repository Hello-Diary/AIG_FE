import { IdiomSuggestion } from "./dictionary";

export interface FeedbackResponse {
  feedbackId: string;
  journalId: string;
  suggestions: IdiomSuggestion[];
  createdAt: Date;
}