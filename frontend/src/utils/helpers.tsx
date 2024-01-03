/*
*  random functions that i didn't want to put in hooks or components because of clutter
*/

// accept only letters and whitespaces
export const isKeyboardCodeAllowed = (code: string) => {
    return (
      code.startsWith("Key") ||
      code.startsWith("Digit") ||
      code === "Backspace" ||
      code === "Space" ||
      code === "Tab" ||
      code === "Enter"
    );
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
  (total typed chars - total errors) / 5 * (60 / seconds)
  */
  let timeNormalizedTo60 = 60 / seconds;
  let totalWords = (chars - errors) / 5
  return parseFloat((totalWords*timeNormalizedTo60).toFixed(2));
};
  
export const formatPercentage = (percentage: number) => {
  return percentage.toFixed(0) + "%";
};

export const formatTime = (time: number) => {
  const timeInSeconds = time / 1000;
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}