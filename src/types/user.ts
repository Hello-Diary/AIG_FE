export interface UserRequest {
  name: string;
  profile: string;
}

export interface UserResponse {
  userId: string;
  email: string;
  name: string;
  profile: string;
  createdAt: Date;
}