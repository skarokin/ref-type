/*
*  Combines useCountdown, useTyping, and useWords to create the typing engine
*  RETURNS:
*   - state: string (start, run, finish)
*   - words: string (the currently generated set of words)
*   - typed: string (the full user input)
*   - errors: number (total number of errors)
*   - restart: function (restarts the typing engine to default state)
*   - timeLeft: number (time left in seconds)
*   - totalTyped: number (total typed characters; used in WPM calculation)
*/

import { useCallback, useEffect, useState } from "react";
import { calculateWPM, debug } from "../utils/helpers";
import useCountdown from "./useCountdown";
import useTyping from "./useTyping";
import useWords from "./useWords";

export type State = "start" | "run" | "finish";

const NUMBER_OF_WORDS = 5;
const COUNTDOWN_SECONDS = 7;

const useEngine = () => {
  const [state, setState] = useState<State>("start");
  const { timeLeft, startCountdown, resetCountdown } = useCountdown(COUNTDOWN_SECONDS);
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { cursor, typed, clearTyped, totalTyped, resetTotalTyped, errors, clearErrors } = 
    useTyping((state !== "finish"), words);
  const [wpm, setWPM] = useState(0);

  const isStarting = state === "start" && cursor > 0;
  const areWordsFinished = cursor === words.length;

  const restart = useCallback(() => {
    debug("restarting...");
    resetCountdown();
    resetTotalTyped();
    setState("start");
    clearErrors();
    setWPM(0);
    updateWords();
    clearTyped();
  }, [clearTyped, updateWords, resetCountdown, resetTotalTyped, clearErrors]);

  // as soon the user starts typing the first letter, we start
  useEffect(() => {
    if (isStarting) {
      setState("run");
      startCountdown();
    }
  }, [isStarting, startCountdown]);

  // when the time is up, we've finished
  useEffect(() => {
    if (!timeLeft && state === "run") {
      debug("time is up...");
      setState("finish");
      setWPM(calculateWPM(totalTyped, errors, COUNTDOWN_SECONDS));
    }
  }, [timeLeft, state, errors, totalTyped]);

  // if user has typed all words AND final character is a whitespace, generate new words
  useEffect(() => {
    if (areWordsFinished && typed[typed.length - 1] === " ") {
      debug("words are finished...");
      updateWords();
      clearTyped();
    }
  }, [clearTyped, areWordsFinished, updateWords, typed]);

  return { state, words, typed, errors, restart, timeLeft, totalTyped, wpm };
};

export default useEngine;