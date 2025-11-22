import { ENDPOINT } from "./endPoint";
import { http } from "./http";
import { JournalRequest, JournalResponse, JournalListResponse } from "../types/journal";

export const getAllJournalApi = async (userId: string, page: number = 1) => {
  const res = await http.get<JournalListResponse>(
    `${ENDPOINT.JOURNAL}/user/${userId}?page=${page}&pageSize=7` // pageSize를 7로 고정하여 요청
  );
  return res;
};

export const getJournalByDateApi = async (userId: string, date?: string) => {
let url = `${ENDPOINT.JOURNAL}/user/${userId}`;
if (date) {
url += `?date=${date}`;
}
const res = await http.get<JournalResponse[]>(url);
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