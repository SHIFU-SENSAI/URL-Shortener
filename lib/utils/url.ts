import { customAlphabet } from "nanoid";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(ALPHABET, 6);

export function generateShortCode(): string {
  return nanoid();
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(alias);
}
