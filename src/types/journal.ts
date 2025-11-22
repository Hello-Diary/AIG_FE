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
  questionId: string | null;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface JournalListResponse {
  journals: JournalResponse[];
  pagination: PaginationInfo;
}