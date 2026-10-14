import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { setAccessTokenProvider } from '@/services/api/client';
import { authApi } from '@/services/auth/auth.api';
import { clearSession, loadSession, saveSession } from '@/services/auth/auth.storage';
import type { AuthSession, SignInPayload, SignUpPayload, User } from '@/services/auth/auth.types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    setAccessTokenProvider(() => tokenRef.current);
    loadSession().then((stored) => {
      tokenRef.current = stored?.accessToken ?? null;
      setSession(stored);
      setIsLoading(false);
    });
  }, []);

  const start = useCallback(async (next: AuthSession, persist: boolean) => {
    tokenRef.current = next.accessToken;
    if (persist) await saveSession(next);
    setSession(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isLoading,
      signIn: async (payload) => start(await authApi.signIn(payload), payload.remember),
      signUp: async (payload) => start(await authApi.signUp(payload), true),
      signOut: async () => {
        await authApi.signOut().catch(() => {});
        tokenRef.current = null;
        await clearSession();
        setSession(null);
      },
    }),
    [session, isLoading, start],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
