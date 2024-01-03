/*
*  Handles typing logic
*  RETURNS:
*   - typed: string (the full user input)
*   - cursor: number (the current position of the cursor)
*   - clearTyped: function (clears user input)
*   - resetTotalTyped: function (resets total typed counter)
*   - totalTyped: number (total typed characters; used in WPM calculation)
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { isKeyboardCodeAllowed } from "../utils/helpers";

const useTypings = (
  enabled: boolean, 
  words: string, 
  userPanelOpened: boolean, 
  leaderboardOpened: boolean,
  setRestartHotKeyPressed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState<string>("");
  const [errors, setErrors] = useState(0);
  const [lastKey, setLastKey] = useState<string>("");
  const totalTyped = useRef(0);

  const keydownHandler = useCallback(
    (event: KeyboardEvent) => {

      const { key, code } = event;

      // prevent default tab behavior ONLY IF user panel is not open
      if (key === "Tab" && !userPanelOpened) {
        event.preventDefault();
      }

      setLastKey(key);

      // tab + enter = restart game; works even when game is finished
      if (key === "Enter" && lastKey === "Tab") {
        setRestartHotKeyPressed(true);
      }

      if (!enabled || !isKeyboardCodeAllowed(code) || userPanelOpened || leaderboardOpened) {
        return;
      }

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor((cursor) => cursor - 1);
          break; 
        case "Tab":
          break;
        case "Enter":
          break;
        default:
          // ensure user can only type up to words.length characters
          if (typed.length < words.length) {
            setTyped((prev) => prev.concat(key));
            setCursor((cursor) => cursor + 1);
            totalTyped.current += 1;

            // if typed character doesn't match the expected character, we count it as an error
            if (key !== words[typed.length]) {
              setErrors((prevErrors) => prevErrors += 1);
            }
          } 
          // if user types more than words.length characters, we count it as an error
          else {
            setErrors((prevErrors) => prevErrors += 1);
            totalTyped.current += 1;
          }
      }
    },
    // we always have the latest typing status, word set, or typed string 
    [enabled, words, typed, userPanelOpened, leaderboardOpened, lastKey, setRestartHotKeyPressed]
  );

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors(0);
  }, []);
 
  // attach the keydown event listener to record keystrokes
  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
    errors,
    clearErrors,
  };
};

export default useTypings;