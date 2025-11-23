import { Suggestion } from "../types/suggestion";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

// (SuggestionScreen에서 isSuggested가 false일 때 호출)
// TODO: post llm api 호출해야 함!
export const getNewSuggestionApi = async (journalId: string) => {
  const res = await http.get<Suggestion[]>(
    `${ENDPOINT.LLM}/${journalId}`
  );
  return res;
};

// 이미 존재하는 피드백(추천 표현) 조회 (GET)
export const getSuggestionApi = async (journalId: string) => {
  const res = await http.get<Suggestion[]>(
    `${ENDPOINT.SUGGESTION}/journal/${journalId}`
  );
  return res;
};