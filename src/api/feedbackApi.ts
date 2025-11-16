import { FeedbackResponse } from "../types/feedback";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

// (SuggestionScreen에서 isSuggested가 false일 때 호출)
export const getNewFeedbackApi = async (journalId: string) => {
  const res = await http.get<FeedbackResponse>(
    `${ENDPOINT.FEEDBACK}/journal/${journalId}`
  );
  return res;
};

// 이미 존재하는 피드백(추천 표현) 조회 (GET)
export const getFeedbackApi = async (journalId: string) => {
  const res = await http.get<FeedbackResponse>(
    `${ENDPOINT.FEEDBACK}/journal/${journalId}`
  );
  return res;
};