export interface UserRequest {
  email: string;
  name: string;
  role: string;
}

export interface UserResponse {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}