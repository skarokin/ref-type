/*
*  random functions that i didn't want to put in hooks or components because of clutter
*/

// accept only letters and whitespaces
export const isKeyboardCodeAllowed = (code: string) => {
    return (
      code.startsWith("Key") ||
      code.startsWith("Digit") ||
      code === "Backspace" ||
      code === "Space"
    );
  };
  
  export const countErrors = (actual: string, expected: string) => {
    const expectedCharacters = expected.split("");
  
    return expectedCharacters.reduce((errors, expectedChar, i) => {
      const actualChar = actual[i];
      if (actualChar !== expectedChar) {
        errors++;
      }
      return errors;
    }, 0);
  };
  
  export const calculateAccuracyPercentage = (errors: number, total: number) => {
    if (total > 0) {
      const corrects = total - errors;
      return (corrects / total) * 100;
    }
  
    return 0;
  };

  export const calculateWPM = (chars: number, errors: number, seconds: number) => {
    /*
    Using the following formula:
                (Total Typed Chars - Uncorrected Chars) / 5
    Net WPM = --------------------------------------------------
                          Time (minutes)
    */
    let minutes = seconds / 60
    let totalWords = (chars - errors) / 5
    return totalWords / minutes;
  };
  
  export const formatPercentage = (percentage: number) => {
    return percentage.toFixed(0) + "%";
  };
  
  export const debug = (str: string) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(str);
    }
  };