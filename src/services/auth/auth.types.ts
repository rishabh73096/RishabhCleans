export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};

export type SignInPayload = { identifier: string; password: string; remember: boolean };
export type SignUpPayload = { name: string; email: string; password: string };
export type ForgotPasswordPayload = { email: string };
