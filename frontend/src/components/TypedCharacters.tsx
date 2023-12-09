/*
*  Displays the user input 
*  Correct characters displayed yellow
*  Incorrect characters displayed red
*  Blank unicode displayed invisible
*/

import cn from "classnames";
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

  // append word break symbol to typedCharacters until the next whitespace character is reached
  while (typedCharacters.length <= nextWhiteSpaceIndex) {
    typedCharacters.push("|");
  }

  return (
    <div className={className}>
      {typedCharacters.map((char, index) => (
        <Character
          key={`${char}_${index}`}
          actual={char}
          expected={words[index]}
          isLastTypedCharacter={index === userInput.length}
        />
      ))}
    </div>
  );
};

const Character = ({
  actual,
  expected,
  isLastTypedCharacter,
}: {
  actual: string;
  expected: string;
  isLastTypedCharacter: boolean;
}) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === " ";
  const isEmpty = actual === "|";

  return (
    <span className={cn({"border-b-2 border-red-300": isLastTypedCharacter})}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn({
          "text-rose-500": !isCorrect && !isWhiteSpace,
          "text-primary-400": isCorrect && !isWhiteSpace,
          "bg-rose-500/50": !isCorrect && isWhiteSpace && !isEmpty,
          "text-opacity-0": isEmpty,
        })}
      >
        {expected}
      </motion.span>
    </span>
  );
};

export default UserTypings;