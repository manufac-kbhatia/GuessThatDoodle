import React, { useEffect, useState } from "react";
import { useAppContext } from "../app/context";
import { States } from "@repo/common";
import Image from "next/image";

const GameHeader = () => {
  const { game, myTurn, choosenWord, guessWord, timer, setTimer } = useAppContext();

  const guessTheWord =
    game?.gameState.state === States.GUESS_WORD && myTurn
      ? choosenWord
      : guessWord.map((word) => "_ ".repeat(word).trim()).join("    ");

  useEffect(() => {
    if (timer <= 0) {
      console.log("running useffect with time", timer);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setTimer, timer]);

  return (
    <div className="flex justify-between items-center p-2 bg-white rounded-md">
      <div className="flex justify-center items-center gap-2 text-2xl">
        <div className="w-15 h-15 relative flex justify-center items-center">
          <Image src="/clock.gif" alt="Thumbs Up" fill className="object-contain" />
          <div className="z-10 font-bold pt-1">{timer}</div>
        </div>
        <div>
          Round {game?.gameState.currentRound} of {game?.gameSettings.rounds}
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center text-2xl">
        {game?.gameState.state === States.GUESS_WORD
          ? myTurn === true
            ? "Draw"
            : "Guess"
          : "Waiting"}
        <div className="text-black">{guessTheWord}</div>
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
