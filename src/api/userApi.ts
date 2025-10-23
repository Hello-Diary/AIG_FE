import { ENDPOINT } from "./endPoint";
import { http } from "./http";

import { UserRequest, UserResponse } from "../types/user";

export const getUserData = async (userId: string) => {
    const res = await http.get<UserResponse>(`${ENDPOINT.USER}/${userId}`);
    return res;
}

export const patchUserData = async (userId: string, data: UserRequest) => {
    const res = await http.patch(`${ENDPOINT.USER}/${userId}`, data);
    return res;
}
