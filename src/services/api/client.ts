import { env } from '@/config/env';

import { ApiError } from './errors';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

let accessTokenProvider: () => string | null = () => null;

/** The auth layer registers how to read the current token; avoids a circular import. */
export function setAccessTokenProvider(provider: () => string | null) {
  accessTokenProvider = provider;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.requestTimeoutMs);
  signal?.addEventListener('abort', () => controller.abort());

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined && { 'Content-Type': 'application/json' }),
  };
  const token = auth ? accessTokenProvider() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0);
  } finally {
    clearTimeout(timeout);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? 'Request failed. Please try again.',
      response.status,
      data?.errors,
    );
  }
  return data as T;
}
