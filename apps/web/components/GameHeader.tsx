import React from "react";
import { useAppContext } from "../app/context";
import { States } from "@repo/common";
import Image from "next/image";

const GameHeader = () => {
  const { gameState, myTurn, choosenWord, guessWord } = useAppContext();

  const guessTheWord =
    gameState.state === States.GUESS_WORD && myTurn
      ? choosenWord
      : guessWord.map((word) => "_ ".repeat(word).trim()).join("    ");

  return (
    <div className="border-2 border-black flex w-full max-w-6xl justify-between items-center backdrop-blur-md">
      <div>Timer</div>
      <div className="flex flex-col gap-2 justify-center items-center text-2xl">
        {gameState.state === States.GUESS_WORD ? (myTurn === true ? "Draw" : "Guess") : "Waiting"}
        <div className="text-white">{guessTheWord}</div>
      </div>

      <div className="flex">
        <div className="w-10 h-10 relative">
          <Image src="/thumbsup.gif" alt="Thumbs Up" fill className="object-contain" />
        </div>
        <div className="w-10 h-10 relative">
          <Image src="/thumbsdown.gif" alt="Thumbs Down" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
