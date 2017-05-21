import { assert } from './Utils';

/**
 * Counts the number of times a character occurs in a string.
 * @param {string} char The character to search for (a string of length 1).
 * @param {string} str The string to search for the character in.
 * @returns {Number} The number of occurrences of char in str.
 */
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

export const letterRangeRegexPart = `a-zA-Z`;
export const letterRegex = new RegExp(`[${letterRangeRegexPart}]`);

export const digitRangeRegexPart = `0-9`;
export const digitRegex = new RegExp(`[${digitRangeRegexPart}]`);

export const englishPunctuationCharListRegexPart = `\.,!\?:;"'\-\(\)\[\]\u2013\u2014`;
export const englishPunctuationRegex = new RegExp(`[${englishPunctuationCharListRegexPart}]`);

/**
 * Tests if a character is a letter or not.
 * @param {string} char The character to test (a string of length 1).
 * @returns {boolean} true if the character is a letter, false otherwise
 */
export function isCharALetter(char: string): boolean {
  assert(char.length === 1);

  return letterRegex.test(char);
}

/**
 * Tests if a character is a digit or not.
 * @param {string} char The character to test (a string of length 1).
 * @returns {boolean} true if the character is a digit, false otherwise
 */
export function isCharADigit(char: string) {
  assert(char.length === 1);

  return digitRegex.test(char);
}

/**
 * Get a RegExp filtering characters based on option parameters.
 * @param {boolean} includeLetters
 * @param {boolean} includeNumbers
 * @param {boolean} includeWhiteSpace
 * @param {boolean} includeOthers
 * @returns {RegExp} The filtering RegExp.
 */
export function charFilteringRegex(includeLetters: boolean, includeNumbers: boolean, includeWhiteSpace: boolean, includeOthers: boolean): RegExp {
  if(!includeOthers) {
    let regexParts = [];

    if(includeLetters) {
      regexParts.push(letterRangeRegexPart);
    }

    if(includeNumbers) {
      regexParts.push(digitRangeRegexPart);
    }

    if(includeWhiteSpace) {
      regexParts.push("\\s");
    }

    return new RegExp(`[${regexParts.join("")}]`);
  } else {
    let regexParts = [];

    if(!includeLetters) {
      regexParts.push(letterRangeRegexPart);
    }

    if(!includeNumbers) {
      regexParts.push(digitRangeRegexPart);
    }

    if(!includeWhiteSpace) {
      regexParts.push("\\s");
    }

    return new RegExp(`[^${regexParts.join("")}]`);
  }
}

export function charCount(str: string, regex: RegExp) {
  let charCount = 0;

  for(let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if(!regex || regex.test(char)) {
      charCount++;
    }
  }
  return charCount;
}
export function charCountExcludingNewLines(str: string) {
  let charCount = 0;

  for(let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if((char !== '\n') && (char !== '\r')) {
      charCount++;
    }
  }

  return charCount;
}

// TODO: handle quoted strings? handle words starting with hyphens?
export function forEachWord(iteratee: (startIndex: number, length: number) => void, str: string) {
  const wordPunctuationRegex = /['-]/;
  const wordFirstCharRegex = new RegExp(`${letterRegex.source}|${wordPunctuationRegex.source}`);
  const wordCharRegex = new RegExp(`${letterRegex.source}|${digitRegex.source}|${wordPunctuationRegex.source}`);
  
  function skipNonWordStartCharacters() {
    while((charIndex < str.length) && (str.charAt(charIndex) != '-') && !wordFirstCharRegex.test(str.charAt(charIndex))) {
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
  skipNonWordStartCharacters();
  
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
    skipNonWordStartCharacters();
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

/** Transforms words to lower-case. */
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

/** Transforms characters to lower-case. */
export function charCounts(str: string): { [char: string]: number } {
  let charCounts: { [char: string]: number } = {};

  for(let i = 0; i < str.length; i++) {
    const lowerCaseChar = str.charAt(i).toLowerCase();

    if(lowerCaseChar in charCounts) {
      charCounts[lowerCaseChar]++;
    } else {
      charCounts[lowerCaseChar] = 1;
    }
  }

  return charCounts;
}