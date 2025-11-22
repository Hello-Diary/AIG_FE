export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId: string;
    name: string;
}

export interface LogoutRequest {
    userId: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}