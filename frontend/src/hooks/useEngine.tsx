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
import { calculateWPM, calculateAccuracyPercentage } from "../utils/helpers";
import { fetchHighScore, updateHighScore } from "../utils/high-score-handler";
import useCountdown from "./useCountdown";
import useTyping from "./useTyping";
import useWords from "./useWords";

export type State = "start" | "run" | "finish";

const NUMBER_OF_WORDS = 23;

const useEngine = (
  userPanelOpened: boolean, 
  leaderboardOpened: boolean, 
  countdown: number,
  wordsContainerRef: React.RefObject<HTMLDivElement>
) => {
  
  const [state, setState] = useState<State>("start");
  const [restartHotKeyPressed, setRestartHotKeyPressed] = useState<boolean>(false);
  const { timeLeft, startCountdown, resetCountdown } = useCountdown(countdown);
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { cursor, typed, clearTyped, totalTyped, resetTotalTyped, errors, clearErrors } = 
    useTyping(state !== "finish", words, userPanelOpened, leaderboardOpened, setRestartHotKeyPressed);
  const [wpm, setWPM] = useState(0);
  const [isNewPB, setIsNewPB] = useState<boolean>(false);

  const isStarting = state === "start" && cursor > 0;
  const areWordsFinished = cursor === words.length;

  const restart = useCallback(() => {
    resetCountdown();
    resetTotalTyped();
    setState("start");
    clearErrors();
    setWPM(0);
    updateWords();
    clearTyped();
    wordsContainerRef.current?.focus();
  }, [clearTyped, updateWords, resetCountdown, resetTotalTyped, clearErrors, wordsContainerRef]);

  const fetchDataAndSetScore = useCallback(async () => {
    const newWPM = calculateWPM(totalTyped, errors, countdown);
    const newAccuracy = calculateAccuracyPercentage(errors, totalTyped);
    setWPM(newWPM);

    const data = await fetchHighScore();
    if (data.auth) {
      if (newWPM > data.highScore) {
        console.log(`updating high score of ${data.username}: currentWPM: ${newWPM}, highScore: ${data.highScore}`);  
        const success = await updateHighScore(data.username, newWPM, newAccuracy);
        if (success) {
          console.log("updateHighScore success");
          setIsNewPB(true);
        } else {
          console.log("updateHighScore failed");
        }
      } 
    }
  }, [countdown, errors, totalTyped]);

  // if restart hotkey is pressed, restart game
  useEffect(() => {
    if (restartHotKeyPressed) {
      restart();
      setRestartHotKeyPressed(false);
    }
  }, [restartHotKeyPressed, restart])

  // as soon the user starts typing the first letter, we start
  useEffect(() => {
    if (isStarting) {
      setState("run");
      startCountdown();
      setIsNewPB(false);
    }
  }, [isStarting, startCountdown]);

  // when the time is up and we are running, finish game
  useEffect(() => {
    if (!timeLeft && state === "run") {
      setState("finish");
      fetchDataAndSetScore();
    }
  }, [timeLeft, state, fetchDataAndSetScore]);

  // if user has typed all words AND final character is a whitespace, generate new words
  useEffect(() => {
    if (areWordsFinished && typed[typed.length - 1] === " ") {
      updateWords();
      clearTyped();
    }
  }, [clearTyped, areWordsFinished, updateWords, typed]);

  return { state, words, typed, errors, restart, timeLeft, totalTyped, wpm, isNewPB };
};

export default useEngine;