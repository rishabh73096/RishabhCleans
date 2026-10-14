import { ApiError } from '@/services/api/errors';

import type { AuthSession, ForgotPasswordPayload, SignInPayload, SignUpPayload } from './auth.types';

/** Stand-in backend so the UI works before a real API exists. Any password of 8+ chars signs in. */
const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

export const authMock = {
  async signIn({ identifier, password }: SignInPayload): Promise<AuthSession> {
    await delay();
    if (password.length < 8) throw new ApiError('Incorrect email or password.', 401);
    return {
      accessToken: 'mock-access-token',
      user: { id: '1', name: 'Sarah Jenkins', email: identifier },
    };
  },
  async signUp({ name, email }: SignUpPayload): Promise<AuthSession> {
    await delay();
    return { accessToken: 'mock-access-token', user: { id: '2', name, email } };
  },
  async forgotPassword(_: ForgotPasswordPayload): Promise<void> {
    await delay();
  },
  async signOut(): Promise<void> {},
};
