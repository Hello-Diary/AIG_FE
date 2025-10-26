import { LoginRequest, LoginResponse, LogoutRequest } from "../types/auth";
import { ENDPOINT } from "./endPoint";
import { http } from "./http";

export const postLoginApi = async (userId: string, data: LoginRequest) => {
    const res = await http.post<LoginRequest, LoginResponse>(`${ENDPOINT.AUTH}/login`, data);
    return res;
};

export const postLogoutApi = async (data: LogoutRequest) => {
    const res = await http.post<LogoutRequest>(`${ENDPOINT.AUTH}/logout`, data);
    return res;
};