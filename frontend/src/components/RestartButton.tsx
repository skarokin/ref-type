/*
*  Displays the restart button
*  The function for restarting is passed as a prop to App.tsx
*  - onRestart() function is defined in useEngine
*/

import React, { useRef } from "react";
import { MdRefresh } from "react-icons/md";

const RestartButton = ({
  onRestart: handleRestart,
  className = "",
}: {
  onRestart: () => void;
  className?: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    buttonRef.current?.blur();
    console.log("reset button clicked")
    handleRestart();
  };

  return (
    <button
      tabIndex={-1} // to prevent focus
      ref={buttonRef}
      className={`rounded px-4 py-2 transition-colors duration-300 ease-in-out hover:text-mainColor ${className}`}
      onClick={handleClick}
    >
      <MdRefresh className="w-6 h-6" />
    </button>
  );
};

export default RestartButton;