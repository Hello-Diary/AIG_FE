import { ENDPOINT } from "./endPoint";
import { http } from "./http";

import { JournalRequest, JournalResponse } from "../types/journal";

export const getAllJournalApi = async (userId: string) => {
  const res = await http.get<JournalResponse[]>(
    `${ENDPOINT.JOURNAL}/user/${userId}`
  );
  return res;
};

export const getJournalApi = async (userId: string, journalId: string) => {
  const res = await http.get<JournalResponse>(
    `${ENDPOINT.JOURNAL}/${journalId}?userId=${userId}`
  );
  return res;
};

export const postJournalApi = async (userId: string, data: JournalRequest) => {
  const res = await http.post<JournalRequest, JournalResponse>(`${ENDPOINT.JOURNAL}?userId=${userId}`, data);
  return res;
};

export const patchJournalApi = async (
  userId: string,
  journalId: string,
  data: JournalRequest
) => {
  const res = await http.patch(
    `${ENDPOINT.JOURNAL}/${journalId}?userId=${userId}`,
    data
  );
  return res;
};

export const deleteJournalApi = async (userId: string, journalId: string) => {
  const res = await http.delete(
    `${ENDPOINT.JOURNAL}/${journalId}?userId=${userId}`
  );
  return res;
};
