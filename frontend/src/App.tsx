import React, { useState } from "react";
import GeneratedWords from "./components/GeneratedWords";
import RestartButton from "./components/RestartButton";
import TestResults from "./components/TestResults";
import TypedCharacters from "./components/TypedCharacters";
import useEngine from "./hooks/useEngine";
import UserPanel from "./components/UserPanel";
import { calculateAccuracyPercentage } from "./utils/helpers";
import { VscGithub } from "react-icons/vsc";
import Confetti from "react-dom-confetti";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  // defined in a parent so we can pass to useEngine
  const [userPanelOpened, setUserPanelOpened] = useState<boolean>(false);

  const { words, typed, timeLeft, errors, state, restart, totalTyped, wpm, showConfetti } =
    useEngine(userPanelOpened);

  return (
    <>
      <Leaderboard 
        className={"fixed top-10 right-20 m-10 flex flex-col items-start"}
      />
      <UserPanel
        setUserPanelOpened={setUserPanelOpened}
        userPanelOpened={userPanelOpened}
      />
      <CountdownTimer timeLeft={timeLeft} />
      <WordsContainer>
        <GeneratedWords key={words} words={words} />
        {/* User typed characters will be overlayed over the generated words; ensure same Tailwind properties */}
        <TypedCharacters
          className="absolute inset-0 break-words whitespace-pre-wrap"
          words={words}
          userInput={typed}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Confetti active={showConfetti} />
        </div>
      </WordsContainer>
      <RestartButton
        className={"mx-auto mt-20 text-slate-500"}
        onRestart={restart}
      />
      <TestResults
        className="absolute bottom-15 left-1/2 transform -translate-x-1/2 w-full mt-10"
        state={state}
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
        wpm={wpm}
      />
      <div className={"fixed bottom-10 left-1/2 flex items-center justify-center transform -translate-x-1/2 text-slate-500"}>
        <VscGithub className={"mr-2"} /> 
        Github 
      </div>
    </>
  );
};

const WordsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-[800px] h-[100px] relative text-3xl max-w-xl leading-relaxed break-words mt-3 select-none">
      {children}
    </div>
  );
};

const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return <h2 className="text-primary-300 font-medium">Time: {timeLeft}</h2>;
};

export default App;