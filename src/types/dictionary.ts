export interface BatchFlashcard {
  suggestionId: string;
  isFlashcard: boolean;
}

export interface BatchFlashcardRequest {
  suggestions: BatchFlashcard[];
}

export interface FlashcardResponse {
  flashcardId: string;
  front: string;
  back: string;
  tags: string[];
  userId: string;
  journalId: string;
  suggestionId: string;
  createdAt: string;
}