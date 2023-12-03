/*
*  Generates a random string of words based on count
*  RETURNS:
*  - words: string (the generated words)
* - updateWords: function (updates the words)
*/

import wordsList from "../utils/words-list";
import { useCallback, useState } from "react";

const generateWords = (count: number) => {
  let words: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = wordsList()[Math.floor(Math.random() * wordsList().length)];
    words.push(word);
  }

  // add a whitespace at the end for natural typing experience
  words[words.length - 1] += " ";

  return words.join(' ');
};

const useWords = (count: number) => {
  const [words, setWords] = useState<string>(generateWords(count));

  const updateWords = useCallback(() => {
    setWords(generateWords(count));
  }, [count]);

  return { words, updateWords };
};

export default useWords;