// export interface IdiomSuggestion {
//   id: string;
//   idiom: string;
//   Meaning: string; // Note: 'M' is capitalized as in your code
//   naturalExample: string;
//   appliedSentence: string;
//   context: string;
//   origin: string;
// }

export interface BatchFlashcard {
  suggestionId: string;
  isFlashcard: boolean;
}

export interface FlashcardRequest {
  suggestions: BatchFlashcard[];
}

export interface FlashcardResponse {
  flashcardId: string;
  front: string;
  back: string;
  tags: string[];
  userId: string;
  journalId: string;
  feedbackId: string;
  createdAt: string;
}