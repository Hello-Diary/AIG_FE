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
  questionId: string;
  title: string;
  content: string;
  emoji: string | null;
  date: string;
  submittedAt: string;
  isSuggested: boolean;
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