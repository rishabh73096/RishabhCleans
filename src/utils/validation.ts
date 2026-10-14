const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9\s-]{7,15}$/;

export const validateEmail = (v: string) =>
  EMAIL.test(v.trim()) ? undefined : 'Enter a valid email address.';

export const validateIdentifier = (v: string) =>
  EMAIL.test(v.trim()) || PHONE.test(v.trim()) ? undefined : 'Enter a valid email or mobile number.';

export const validatePassword = (v: string) =>
  v.length >= 8 ? undefined : 'Password must be at least 8 characters.';

export const validateName = (v: string) =>
  v.trim().length >= 2 ? undefined : 'Enter your full name.';
