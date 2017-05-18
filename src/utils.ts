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

export function getCharRegex(includePunctuation: boolean, includeWhiteSpace: boolean): RegExp {
  let regex: RegExp;

  if(!includePunctuation) {
    if(!includeWhiteSpace) {
      regex = new RegExp(letterRegex.source + "|" + digitRegex.source);
    } else {
      regex = new RegExp(letterRegex.source + "|" + digitRegex.source + "|" + (/\s/).source);
    }
  } else {
    if(!includeWhiteSpace) {
      regex = /[^\s]/;
    } else {
      regex = new RegExp("");
    }
  }

  return regex;
}

export const englishPunctuationRegex = /[\.,!\?:;"'\-\(\)\[\]\u2013\u2014]/;
export function charCount(str: string, includePunctuation: boolean, includeWhiteSpace: boolean) {
  const regex = getCharRegex(includePunctuation, includeWhiteSpace);
  let charCount = 0;

  for(let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if(regex.test(char)) {
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
export function charCountExcludingWhiteSpace(str: string) {
  const whiteSpaceRegex = /\s/;
  let charCount = 0;

  for(let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if(!whiteSpaceRegex.test(char)) {
      charCount++;
    }
  }

  return charCount;
}
export function charCountExcludingWhiteSpaceAndPunctuation(str: string) {
  let charCount = 0;

  for(let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if(letterRegex.test(char) || digitRegex.test(char)) {
      charCount++;
    }
  }

  return charCount;
}

// TODO: handle quoted strings? handle words starting with hyphens?
export function forEachWord(iteratee: (startIndex: number, length: number) => void, str: string) {
  const wordPunctuationRegex = /['-]/;
  const wordCharRegex = new RegExp(`${letterRegex.source}|${digitRegex.source}|${wordPunctuationRegex.source}`);
  
  function skipNonWordStartCharacters() {
    while((charIndex < str.length) && (str.charAt(charIndex) != '-') && !wordCharRegex.test(str.charAt(charIndex))) {
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