import 'server-only';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * SERVER-ONLY: Hash a string using bcrypt
 * This function can only be used in server components and API routes
 * @param str - String to hash
 * @returns Promise resolving to hashed string
 */
export async function hashString(str: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(str, saltRounds);
}

/**
 * SERVER-ONLY: Verify a string against a bcrypt hash
 * This function can only be used in server components and API routes
 * @param str - Plain text string to verify
 * @param hashedStr - Hashed string to compare against
 * @returns Promise resolving to boolean indicating match
 */
export async function verifyHashString(str: string, hashedStr: string): Promise<boolean> {
  return bcrypt.compare(str, hashedStr);
}

/**
 * SERVER-ONLY: Generate a random string using crypto
 * This function can only be used in server components and API routes
 * @param length - Length of random bytes (default: 32)
 * @returns Base64URL encoded random string
 */
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * SERVER-ONLY: Hash text using PBKDF2
 * This function can only be used in server components and API routes
 * @param text - Text to hash
 * @returns Hexadecimal hash string
 */
export function pbkdf2Hash(text: string): string {
  const salt = process.env.HASH_SALT_KEY || '';
  return crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha256').toString('hex');
}

/**
 * SERVER-ONLY: Verify text against a PBKDF2 hash
 * This function can only be used in server components and API routes
 * @param text - Plain text to verify
 * @param hash - Hash to compare against
 * @returns Boolean indicating match
 */
export function pbkdf2Verify(text: string, hash: string): boolean {
  const computedHash = pbkdf2Hash(text);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
}

/**
 * SERVER-ONLY: Generate a 6-digit verification code
 * This function can only be used in server components and API routes
 * @returns 6-digit numeric string
 */
export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
