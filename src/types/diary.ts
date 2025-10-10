export interface Suggestion {
  idiom: string;
  origin: string;
  Meaning: string;
  context: string;
  naturalExample: string;
  appliedSentence: string;
}

export interface FeedbackRequest {
  journalId: string;
  suggestions: Suggestion[];
}

export interface FeedbackResponse {
  feedbackId: string;
  journalId: string;
  suggestions: Suggestion[];
  createdAt: string;
}