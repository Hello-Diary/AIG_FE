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