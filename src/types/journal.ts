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
