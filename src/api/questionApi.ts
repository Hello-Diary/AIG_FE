import { ENDPOINT } from "./endPoint";
import { http } from "./http";

import { Question } from "../types/question";

export const getAllQuestion = async () => {
    const res = await http.get<Question[]>(`${ENDPOINT.QUESTION}`);
    return res;
}
