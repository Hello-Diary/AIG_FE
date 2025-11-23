import { Suggestion } from "../types/suggestion";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

// (SuggestionScreen에서 isSuggested가 false일 때 호출)
export const postNewSuggestionApi = async (journalId: string) => {
  const res = await http.post<null, Suggestion[]>(
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