import { faker } from "@faker-js/faker";
import { useCallback, useState } from "react";

const generateWords = (count: number) => {
  let words = faker.word.words(count);

  // filter words with hyphens
  words = words.split(' ').filter(word => !word.includes('-')).join(' ');

  // add a whitespace at the end of the string (for natural typing experience)
  words = words + ' ';

  return words;
};

const useWords = (count: number) => {
  const [words, setWords] = useState<string>(generateWords(count));

  const updateWords = useCallback(() => {
    setWords(generateWords(count));
  }, [count]);

  return { words, updateWords };
};

export default useWords;