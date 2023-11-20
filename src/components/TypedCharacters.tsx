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

  // map() is being used to transform typedCharacters into an array of <Character> components
  // with each component representing a character the user has typed
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

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={cn({
        "text-red-500": !isCorrect && !isWhiteSpace,
        "text-primary-400": isCorrect && !isWhiteSpace,
        "bg-red-500/50": !isCorrect && isWhiteSpace,
      })}
    >
      {expected}
    </motion.span>
  );
};

export default UserTypings;