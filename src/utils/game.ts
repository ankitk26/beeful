import dailyPuzzles from "./daily-puzzles.json";

// Simple polyfill or usage of browser crypto for SHA-256
export async function hashString(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

function getLocalDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyPuzzle(dateString?: string) {
  // If no date provided, use today LOCAL time YYYY-MM-DD
  const dateStr = dateString || getLocalDateString();

  // Use a fallback if date somehow out of range (like year 2026)
  // Our generator gave us today + 365, but just in case:
  const puzzle =
    (dailyPuzzles as any)[dateStr] || Object.values(dailyPuzzles)[0];

  return {
    date: dateStr,
    centerLetter: puzzle.centerLetter,
    letters: puzzle.letters,
    validHashes: puzzle.validHashes, // Will be kept in memory but not easily read by user
  };
}

export function isValidWord(
  word: string,
  centerLetter: string,
  letters: string[],
): { valid: boolean; error?: string } {
  const lowerWord = word.toLowerCase();

  if (lowerWord.length < 4) {
    return { valid: false, error: "Too short" };
  }

  if (!lowerWord.includes(centerLetter)) {
    return { valid: false, error: "Missing center letter" };
  }

  for (const char of lowerWord) {
    if (!letters.includes(char)) {
      return { valid: false, error: "Bad letters" };
    }
  }

  return { valid: true }; // Structural check passes
}

export function calculateScore(word: string): number {
  if (word.length === 4) return 1;
  const isPangram = new Set(word).size === 7;
  return word.length + (isPangram ? 7 : 0);
}
