export function generatePuzzle(pangrams: string[]): { centerLetter: string, letters: string[] } {
    // Pick a random pangram
    const randomIndex = Math.floor(Math.random() * pangrams.length);
    const pangram = pangrams[randomIndex];

    const uniqueLetters = Array.from(new Set(pangram));

    // Shuffle the letters
    for (let i = uniqueLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueLetters[i], uniqueLetters[j]] = [uniqueLetters[j], uniqueLetters[i]];
    }

    // The center letter is the first one in our shuffled array
    const centerLetter = uniqueLetters[0];

    return {
        centerLetter,
        letters: uniqueLetters,
    };
}

export function isValidWord(word: string, centerLetter: string, letters: string[], allWords: Set<string>): { valid: boolean; error?: string } {
    const lowerWord = word.toLowerCase();

    if (lowerWord.length < 4) {
        return { valid: false, error: 'Too short' };
    }

    if (!lowerWord.includes(centerLetter)) {
        return { valid: false, error: 'Missing center letter' };
    }

    for (const char of lowerWord) {
        if (!letters.includes(char)) {
            return { valid: false, error: 'Bad letters' };
        }
    }

    if (!allWords.has(lowerWord)) {
        return { valid: false, error: 'Not in word list' };
    }

    return { valid: true };
}

export function calculateScore(word: string): number {
    if (word.length === 4) return 1;
    const isPangram = new Set(word).size === 7;
    return word.length + (isPangram ? 7 : 0);
}
