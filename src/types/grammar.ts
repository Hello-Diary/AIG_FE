export interface Edit {
  start: number;
  end: number;
  replace: string;
  editType: string;
  errCat: string;
  errType: string;
  errDesc: string;
}

export interface GrammarRequest {
  text: string;
}

export interface GrammarResponse {
  correction: string;
  status: number;
  edits: Edit[];
  latency: number;
}