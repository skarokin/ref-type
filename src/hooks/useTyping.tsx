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

const useTypings = (enabled: boolean, words: string) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState<string>("");
  const totalTyped = useRef(0);

  const keydownHandler = useCallback(
    ({ key, code }: KeyboardEvent) => {
      if (!enabled || !isKeyboardCodeAllowed(code)) {
        return;
      }

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor((cursor) => cursor - 1);
          totalTyped.current -= 1;
          break;
        default:
          // ensure user can only type up to words.length characters
          if (typed.length < words.length) {
            setTyped((prev) => prev.concat(key));
            setCursor((cursor) => cursor + 1);
            totalTyped.current += 1;
          } 
      }
    },
    // we always have the latest typing status, word set, or typed string 
    [enabled, words, typed]
  );

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
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
  };
};

export default useTypings;