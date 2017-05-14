export function assert(condition: boolean) {
  if(!condition) {
    throw new Error("Failed assertion.");
  }
}

export function reduceObjectPropertyNames<T>(iteratee: (accumulator: T, propertyName: string) => T, obj: object, initialValue: T): T {
  let accumulator = initialValue;
  
  for(let propertyName in obj) {
    accumulator = iteratee(accumulator, propertyName);
  }

  return accumulator;
}

export function charOccurrenceCount(char: string, str: string): number {
  assert(char.length === 1);

  let charOccurrenceCount = 0;

  for(let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) {
      charOccurrenceCount++;
    }
  }

  return charOccurrenceCount;
}

export const letterRegex = /[a-zA-Z]/;
export function isCharALetter(char: string) {
  assert(char.length === 1);

  return letterRegex.test(char);
}

export const digitRegex = /[0-9]/;
export function isCharADigit(char: string) {
  assert(char.length === 1);

  return digitRegex.test(char);
}

export function forEachWord(iteratee: (startIndex: number, length: number) => void, str: string) {
  const wordPunctuationRegex = /['-]/;
  const wordCharRegex = new RegExp(`${letterRegex.source}|${digitRegex.source}|${wordPunctuationRegex.source}`);
  
  function skipNonWordCharacters() {
    while((charIndex < str.length) && !wordCharRegex.test(str.charAt(charIndex))) {
      charIndex++;
    }
  }

  /** Returns true if the string of word characters contains a letter or digit, false otherwise. */
  function skipWordCharacters(): boolean {
    let wordContainsALetter = false;

    while((charIndex < str.length) && wordCharRegex.test(str.charAt(charIndex))) {
      const char = str.charAt(charIndex);
      if(!wordContainsALetter && (isCharALetter(char) || isCharADigit(char))) {
        wordContainsALetter = true;
      }

      charIndex++;
    }

    return wordContainsALetter;
  }

  let charIndex = 0;

  // Skip to the first word or the end of the string.
  skipNonWordCharacters();
  
  // While at the start of a word and not the end of the string:
  while(charIndex < str.length) {
    const wordStartIndex = charIndex;
    const wordContainsALetter = skipWordCharacters(); // Skip to just past the word.

    // The "word" might actually only contain punctuation. Check that the word actually contains letters.
    if(wordContainsALetter) {
      const wordLength = charIndex - wordStartIndex;
      
      iteratee(wordStartIndex, wordLength);
    }

    // Skip to the next word.
    skipNonWordCharacters();
  }
}

export function wordCount(str: string): number {
  let wordCount = 0;
  forEachWord((startIndex: number, length: number) => wordCount++, str);
  return wordCount;
}

export function nonUniqueWordsInString(str: string): string[] {
  let words: string[] = [];
  forEachWord((startIndex: number, length: number) => words.push(str.substr(startIndex, length)), str);
  return words;
}

/** Transforms words to lowerCase. */
// TODO: handle quoted strings? handle words starting with hyphens?
export function wordCounts(str: string): { [word: string]: number } {
  let wordCounts: { [word: string]: number } = {};

  forEachWord((startIndex: number, length: number) => {
    const lowerCaseWord = str.substr(startIndex, length).toLowerCase();

    if(!(lowerCaseWord in wordCounts)) {
      wordCounts[lowerCaseWord] = 1;
    } else {
      wordCounts[lowerCaseWord]++;
    }
  }, str);

  return wordCounts;
}