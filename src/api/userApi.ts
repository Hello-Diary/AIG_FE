import { ENDPOINT } from "./endPoint";
import { http } from "./http";

import { UserPatchRequest, UserResponse } from "../types/user";

export const getUserDataApi = async (userId: string) => {
  const res = await http.get<UserResponse>(`${ENDPOINT.USER}/${userId}`);
  return res;
};

export const patchUserDataApi = async (userId: string, data: UserPatchRequest) => {
  const res = await http.patch(`${ENDPOINT.USER}/${userId}`, data);
  return res;
};

export const deleteUserApi = async (userId: string) => {
  const res = await http.delete(`${ENDPOINT.USER}/${userId}`);
  return res;
};