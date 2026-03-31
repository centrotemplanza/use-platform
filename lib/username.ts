import { RESERVED_USERNAMES } from "@/config/reserved-usernames";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isReservedUsername(value: string) {
  return RESERVED_USERNAMES.has(normalizeUsername(value));
}

export function validateUsername(value: string) {
  const username = normalizeUsername(value);

  if (!username) {
    return { isValid: false, normalized: username, message: "Enter a username." };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return { isValid: false, normalized: username, message: "Too short." };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { isValid: false, normalized: username, message: "Too long." };
  }

  if (!/^[a-z0-9._]+$/.test(username)) {
    return { isValid: false, normalized: username, message: "Invalid characters." };
  }

  if (/^[._]/.test(username) || /[._]$/.test(username)) {
    return { isValid: false, normalized: username, message: "Invalid format." };
  }

  if (/(\.\.|__|\._|_\.)/.test(username)) {
    return { isValid: false, normalized: username, message: "Invalid format." };
  }

  if (/^\d+$/.test(username)) {
    return { isValid: false, normalized: username, message: "Use letters too." };
  }

  if (isReservedUsername(username)) {
    return { isValid: false, normalized: username, message: "Not available." };
  }

  return { isValid: true, normalized: username, message: "OK" };
}