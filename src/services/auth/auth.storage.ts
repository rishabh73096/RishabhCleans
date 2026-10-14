import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthSession } from './auth.types';

const KEY = 'auth.session';

// SecureStore has no web implementation; fall back to localStorage there.
const store = {
  get: async (): Promise<string | null> =>
    Platform.OS === 'web' ? globalThis.localStorage?.getItem(KEY) ?? null : SecureStore.getItemAsync(KEY),
  set: async (value: string) =>
    Platform.OS === 'web' ? globalThis.localStorage?.setItem(KEY, value) : SecureStore.setItemAsync(KEY, value),
  remove: async () =>
    Platform.OS === 'web' ? globalThis.localStorage?.removeItem(KEY) : SecureStore.deleteItemAsync(KEY),
};

export async function loadSession(): Promise<AuthSession | null> {
  try {
    const raw = await store.get();
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export const saveSession = (session: AuthSession) => store.set(JSON.stringify(session));
export const clearSession = () => store.remove();
