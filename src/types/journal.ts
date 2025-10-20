export interface JournalRequest {
  title: string;
  content: string;
  questionId: string;
}

export interface JournalResponse {
  journalId: string;
  userId: string;
  title: string;
  content: string;
  submittedAt: Date;
}
