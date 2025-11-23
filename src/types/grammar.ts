export interface Edit {
  start: number;
  end: number;
  replace: string;
  editType: string;
  err_cat: string;
  err_type: string;
  err_desc: string;
}

// API 응답을 가공하여 렌더링할 UI 조각의 타입
export type ProcessedSegment = {
  text: string;
  key: string;
  wrong?: string;
  explanation?: string;
};

export interface GrammarRequest {
  text: string;
}

export interface GrammarResponse {
  correction: string;
  status: number;
  edits: Edit[];
  latency: number;
}