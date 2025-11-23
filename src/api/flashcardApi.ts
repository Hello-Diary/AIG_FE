import {
  BatchFlashcardRequest,
  FlashcardResponse,
} from "../types/dictionary";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

export const getSavedFlashcardsApi = async (userId: string) => {
  const res = await http.get<FlashcardResponse[]>(`${ENDPOINT.DICTIONARY}/user/${userId}`);
  return res;
};

export const batchToggleFlashcardsApi = async (
  data: BatchFlashcardRequest
) => {
  const res = await http.put<BatchFlashcardRequest, FlashcardResponse[]>(
    `${ENDPOINT.DICTIONARY}/batch/toggle-suggestions`,
    data
  );
  return res;
};