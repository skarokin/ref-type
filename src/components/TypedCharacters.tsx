/*
*  Displays the user input 
*  Correct characters displayed yellow
*  Incorrect characters displayed red
*  Blank unicode displayed invisible
*/

import cn from "classnames";
import Caret from "./Caret";
import { motion } from "framer-motion";

const UserTypings = ({
  userInput,
  words,
  className = "",
}: {
  userInput: string;
  words: string;
  className?: string;
}) => {
  
  const typedCharacters = userInput.split("");

  // find the next whitespace character in generatedWords
  const nextWhiteSpaceIndex = words.indexOf(" ", typedCharacters.length);

  // append invisible whitespace to typedCharacters until the next whitespace character is reached
  while (typedCharacters.length < nextWhiteSpaceIndex) {
    typedCharacters.push("\u200b");
  }
  
  // map over typedCharacters and return a <Character> component for each character
  return (
    <div className={className}>
      {typedCharacters.map((char, index) => (
        <Character
          key={`${char}_${index}`}
          actual={char}
          expected={words[index]}
        />
      ))}
      <Caret />
    </div>
  );  
};

const Character = ({
  actual,
  expected,
}: {
  actual: string;
  expected: string;
}) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === " ";


  const isEmptySpace = actual === "\u200b";
  
  // if empty space, return an empty span to ensure caret is properly positioned
  if (isEmptySpace) {
    return <span/>;
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={cn({
        "text-red-500": !isCorrect && !isWhiteSpace,
        "text-primary-400": isCorrect && !isWhiteSpace,
        "bg-red-500/50": !isCorrect && isWhiteSpace,
        "text-opacity-0": isEmptySpace,
      })}
    >
      {expected}
    </motion.span>
  );
};

export default UserTypings;