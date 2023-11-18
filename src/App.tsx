import React from "react";
import { faker } from "@faker-js/faker";
import RestartButton from "./components/RestartButton";
import TestResults from "./components/TestResults";
import TypedCharacters from "./components/TypedCharacters";
import useEngine from "./hooks/useEngine";
import { calculateAccuracyPercentage } from "./utils/helpers";

const words = faker.word.words(10);

function App() {
  const { state, words, timeLeft, typed, errors, restart, totalTyped } = useEngine(); 
  // the order of the components defines where they are rendered
  return (
    <>
      <Countdown timeLeft = {timeLeft} />
      {/* Overlay the typed characters onto the generated words; 
          GeneratedWords and TypedCharacters share the same Tailwind properties */}
      <WordsContainer>
        <GeneratedWords words = {words} />
        {/* pass the generated words into TypedCharacters */}
        <TypedCharacters 
          className="absolute inset-0" 
          words={words} 
          userInput = {typed}
        />
      </WordsContainer>
      <RestartButton
        className={"mx-auto mt-10 text-slate-500"}
        onRestart={() => null}
      />
      <TestResults
        className="mt-10"
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
        state={state}
      />
    </>
  );
}

const WordsContainer = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className="relative max-w-xl mt-3 text-3xl leading-relaxed break-all">
      {children}
    </div>
  )
};

// this function takes string param "words" and returns the words to show on the screen
const GeneratedWords = ({ words }: { words: string }) => {
  return <div className="text-blue-200">
    {words}
  </div>;
};

// this function takes number parameter "timeLeft" and returns the timeLeft
const Countdown = ({ timeLeft }: {timeLeft: number}) => {
  return <h2 className="text-primary-300 font-medium"> Time: { timeLeft }
  </h2>
};

export default App;
