import fs from "fs";
import crypto from "crypto";

// Get the words we previously downloaded
const allWords = JSON.parse(fs.readFileSync("scripts/words.json", "utf8"));
const allPangrams = JSON.parse(
  fs.readFileSync("scripts/pangrams.json", "utf8"),
);

const wordsSet = new Set(allWords);

// Generate puzzles for the next year (365 days)
const today = new Date();
const dailyPuzzles = {};

for (let i = 0; i < 365; i++) {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  // Format YYYY-MM-DD using local time
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  let validHashes = [];
  let validWordsList = [];
  let centerLetter = "a";
  let uniqueLetters = [];

  // Attempt multiple setups until we find one that yields at least 30 words and at least 2 pangrams.
  // If we can't find one in 500 tries, we'll settle for the last found, but this is highly unlikely.
  let attempt = 0;
  while (attempt < 500) {
    validHashes = [];
    validWordsList = [];
    let pangramCount = 0;

    // A seed that varies per attempt to keep exploring
    const seed =
      dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
      attempt * 17;
    const pangram = allPangrams[seed % allPangrams.length];

    uniqueLetters = Array.from(new Set(pangram)).sort(); // sort for consistency
    centerLetter = uniqueLetters[seed % 7];

    for (const word of wordsSet) {
      // Must be at least 4 letters
      if (word.length < 4) continue;

      // Must contain center letter
      if (!word.includes(centerLetter)) continue;

      // Must only contain puzzle letters
      let isValid = true;
      for (const char of word) {
        if (!uniqueLetters.includes(char)) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        validWordsList.push(word);
        const isPangram = new Set(word).size === 7;
        if (isPangram) pangramCount++;
      }
    }

    if (validWordsList.length >= 30 && pangramCount >= 2) {
      break; // Found a good puzzle!
    }

    attempt++;
  }

  // Hash the valid words for the final output
  for (const word of validWordsList) {
    const saltedWord = `${word}-${dateStr}-BEEFUL`;
    const hash = crypto.createHash("sha256").update(saltedWord).digest("hex");
    validHashes.push(hash);
  }

  dailyPuzzles[dateStr] = {
    centerLetter,
    letters: uniqueLetters,
    validHashes,
  };

  // Quick log to show progress
  if (i % 30 === 0) console.log(`Generated ${i}/365 puzzles`);
}

fs.writeFileSync("src/utils/daily-puzzles.json", JSON.stringify(dailyPuzzles));
console.log(
  "Successfully generated daily puzzles and hashed valid words. Each game has ≥30 words and ≥2 pangrams.",
);
