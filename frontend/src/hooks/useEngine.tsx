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
import { calculateWPM, calculateAccuracyPercentage, debug } from "../utils/helpers";
import { fetchHighScore, updateHighScore } from "../utils/high-score-handler";
import useCountdown from "./useCountdown";
import useTyping from "./useTyping";
import useWords from "./useWords";

export type State = "start" | "run" | "finish";

const NUMBER_OF_WORDS = 10;

const useEngine = (userPanelOpened: boolean, countdown: number) => {
  
  const [state, setState] = useState<State>("start");
  const { timeLeft, startCountdown, resetCountdown } = useCountdown(countdown);
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { cursor, typed, clearTyped, totalTyped, resetTotalTyped, errors, clearErrors } = 
    useTyping(state !== "finish", words, userPanelOpened);
  const [wpm, setWPM] = useState(0);
  const [auth, setAuth] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [highScore, setHighScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

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
      setShowConfetti(false);
    }
  }, [isStarting, startCountdown]);

  // when the time is up, we've finished
  useEffect(() => {
    const fetchDataAndSetScore = async () => {
      if (!timeLeft && state === "run") {
        setState("finish");
        const newWPM = calculateWPM(totalTyped, errors, countdown);
        const newAccuracy = calculateAccuracyPercentage(errors, totalTyped);
        setWPM(newWPM);
        setAccuracy(newAccuracy);

        const data = await fetchHighScore();
        if (data.auth) {
          console.log('fetchHighScore was successful'); 
          setAuth(true);
          setUsername(data.username);
          setHighScore(data.highScore);

          if (newWPM > data.highScore) {
            console.log(`updating high score of ${data.username}: currentWPM: ${newWPM}, highScore: ${data.highScore}`);  
            const success = await updateHighScore(data.username, newWPM, newAccuracy);
            if (success) {
              console.log("updateHighScore success");
              setShowConfetti(true);
            } else {
              console.log("updateHighScore failed");
            }
          } 
        }
      };
    };
    fetchDataAndSetScore();
  }, [timeLeft, state, errors, totalTyped, auth, username, highScore]);

  // if user has typed all words AND final character is a whitespace, generate new words
  useEffect(() => {
    if (areWordsFinished && typed[typed.length - 1] === " ") {
      debug("words are finished...");
      updateWords();
      clearTyped();
    }
  }, [clearTyped, areWordsFinished, updateWords, typed]);

  return { state, words, typed, errors, restart, timeLeft, totalTyped, wpm, showConfetti };
};

export default useEngine;