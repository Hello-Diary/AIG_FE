import {
  FlashcardRequest,
  FlashcardResponse,
} from "../types/dictionary";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

export const getSavedFlashcardsApi = async () => {
  const res = await http.get<FlashcardResponse[]>(`${ENDPOINT.DICTIONARY}/flashcards`);
  return res;
};

export const batchToggleFlashcardsApi = async (
  data: FlashcardRequest
) => {
  const res = await http.put<FlashcardRequest, FlashcardResponse[]>(
    `${ENDPOINT.DICTIONARY}/batch/toggle`,
    data
  );
  return res;
};