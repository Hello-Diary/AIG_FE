export interface JournalRequest {
  title: string;
  content: string;
  emoji: string | null;
  date: Date;
  questionId: string | null;
}

export interface JournalResponse {
  journalId: string;
  userId: string;
  title: string;
  content: string;
  emoji: string | null;
  date: Date;
  submittedAt: Date;
  isSuggested: boolean;
}
