import { SuggestionResponse } from "../types/feedback";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

export const getAllSuggestionsApi = async () => {
  const res = await http.get<SuggestionResponse>(`${ENDPOINT.SUGGESTION}`);
  return res;
};

export const getSuggestionByJournalIdApi = async (journalId: string) => {
  const res = await http.get<SuggestionResponse>(
    `${ENDPOINT.SUGGESTION}/journal/${journalId}`
  );
  return res;
};
