import { Question } from "./question";
import { Suggestion } from "./suggestion";
import { UserSuggestionResponse } from "./user";

export interface JournalRequest {
  title: string;
  content: string;
  emoji: string | null;
  date: string;
  questionId: string | null;
}

export interface JournalResponse {
  journalId: string;
  userId: string;
  title: string;
  content: string;
  emoji: string | null;
  date: string;
  submittedAt: string;
  isSuggested: boolean;
}

export interface JournalSuggestionResponse {
  journalId: string;
  user: UserSuggestionResponse;
  title: string;
  content: string;
  emoji: string | null;
  date: string;
  submittedAt: string;
  question: Question;
  suggestion: Suggestion[];
  isSuggested: boolean;
}
