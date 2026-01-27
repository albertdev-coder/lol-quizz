import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * PURE UTILITY: Merge Tailwind CSS classes with proper precedence
 * This is a pure function safe for both client and server
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
