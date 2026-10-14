/** Leave EXPO_PUBLIC_API_URL unset to run auth against the in-app mock. */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  requestTimeoutMs: 15_000,
} as const;

export const useMockApi = env.apiUrl === '';
