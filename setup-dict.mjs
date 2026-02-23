import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt';

console.log('Downloading dictionary...');

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Filtering dictionary...');
    const words = data.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(Boolean);

    // Filter conditions:
    // 1. Minimum 4 letters
    // 2. Maximum of 7 unique chars in the word (since our game has exactly 7 letters!)
    // If a word has >7 unique chars, it could never be made from a 7-letter pool.
    const validWords = words.filter(w => {
      if (w.length < 4) return false;
      const uniqueChars = new Set(w).size;
      return uniqueChars <= 7;
    });

    // We also need some "pangrams" (words with exactly 7 unique letters) to use as puzzle roots.
    const pangrams = validWords.filter(w => new Set(w).size === 7);

    fs.mkdirSync('src/utils', { recursive: true });

    // Just keeping the list of valid words
    fs.writeFileSync('src/utils/words.json', JSON.stringify(validWords));
    fs.writeFileSync('src/utils/pangrams.json', JSON.stringify(pangrams));

    console.log(`Saved ${validWords.length} valid words and ${pangrams.length} pangrams.`);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
