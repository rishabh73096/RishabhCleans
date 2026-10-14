import { useMockApi } from '@/config/env';
import { request } from '@/services/api/client';

import { authMock } from './auth.mock';
import type { AuthSession, ForgotPasswordPayload, SignInPayload, SignUpPayload } from './auth.types';

const real = {
  signIn: (payload: SignInPayload) =>
    request<AuthSession>('/auth/sign-in', { method: 'POST', body: payload }),
  signUp: (payload: SignUpPayload) =>
    request<AuthSession>('/auth/sign-up', { method: 'POST', body: payload }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<void>('/auth/forgot-password', { method: 'POST', body: payload }),
  signOut: () => request<void>('/auth/sign-out', { method: 'POST', auth: true }),
};

export const authApi = useMockApi ? authMock : real;
