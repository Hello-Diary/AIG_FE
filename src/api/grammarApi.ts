import { GrammarRequest, GrammarResponse } from "../types/feedback";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

export const postGrammarCheckApi = async (data: GrammarRequest) => {
  const res = await http.post<GrammarRequest, GrammarResponse>(`${ENDPOINT.GRAMMAR}`, data);
  return res;
};
