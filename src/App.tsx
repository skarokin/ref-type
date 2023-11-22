import React from "react";
import GeneratedWords from "./components/GeneratedWords";
import RestartButton from "./components/RestartButton";
import TestResults from "./components/TestResults";
import TypedCharacters from "./components/TypedCharacters";
import useEngine from "./hooks/useEngine";
import { calculateAccuracyPercentage } from "./utils/helpers";

const App = () => {
  const { words, typed, timeLeft, errors, state, restart, totalTyped, wpm} =
    useEngine();

  return (
    <>
      <CountdownTimer timeLeft={timeLeft} />
      <WordsContainer>
        <GeneratedWords key={words} words={words} />
        {/* User typed characters will be overlayed over the generated words; ensure same Tailwind properties */}
        <TypedCharacters
          className="absolute inset-0 break-words whitespace-pre-wrap"
          words={words}
          userInput={typed}
        />
      </WordsContainer>
      <RestartButton
        className={"mx-auto mt-10 text-slate-500"}
        onRestart={restart}
      />
      <TestResults
        className="mt-10"
        state={state}
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
        wpm={wpm}
      />
    </>
  );
};

const WordsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[500px] h-[150px] relative text-3xl max-w-xl leading-relaxed break-words mt-3">
      {children}
    </div>
  );
};

const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return <h2 className="text-primary-300 font-medium">Time: {timeLeft}</h2>;
};

export default App;