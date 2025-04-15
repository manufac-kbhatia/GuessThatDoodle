"use client";
import { GameEvents, StartGame, States, WordSelected } from "@repo/common";
import React, { useMemo, useState } from "react";
import { useAppContext } from "../app/context";
import Drawboard from "./Canvas";
import GameHeader from "./GameHeader";

const GameScreen = () => {
  const {
    players,
    gameState,
    currentPlayer,
    game,
    me,
    socket,
    myTurn,
    gameSettings,
    words,
    choosenWord,
    guessWord,
  } = useAppContext();
  const [chats] = useState<string[]>(["hi", "there"]);

  const handleStart = () => {
    if (!socket || !game) return;
    const data: StartGame = {
      type: GameEvents.START_GAME,
      gameId: game.gameId,
    };
    socket.send(JSON.stringify(data));
  };

  const handleWordSelect = (word: string) => {
    if (!game || !currentPlayer || !socket) return;
    const data: WordSelected = {
      type: GameEvents.WORD_SELECTED,
      gameId: game.gameId,
      playerId: currentPlayer.id,
      word,
    };
    socket.send(JSON.stringify(data));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-1  ">
      <GameHeader />
      <div className="grid grid-cols-12 w-full max-w-6xl border-2 border-black h-[70%]">
        <div className="col-span-2 flex flex-col">
          {players.map((player) => {
            return (
              <div key={player.id} className="flex flex-col border-2 border-black">
                <div>
                  {player.name}
                  {game?.creator.id === player.id ? <>(Admin)</> : null}
                  {player.id === me?.id ? <>(You)</> : null}
                </div>
                <div>Score: {player.score}</div>
              </div>
            );
          })}
        </div>
        <div className="col-span-7 bg-neutral-400 h-full w-full">
          {gameState.state === States.WAITING ? <div>{JSON.stringify(gameSettings)}</div> : null}
          {gameState.state === States.CHOOSING_WORD && myTurn === true ? (
            <div className="flex justify-center items-center w-full h-full gap-5">
              {words.map((word) => (
                <button
                  className="border-2 border-black w-16"
                  key={word}
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          ) : null}
          {gameState.state === States.CHOOSING_WORD && myTurn === false ? (
            <div>{currentPlayer?.name} is choosing a word</div>
          ) : null}

          {gameState.state === States.GUESS_WORD ? <Drawboard /> : null}
        </div>
        <div className="col-span-3 border-2 border-red-900 flex flex-col">
          {chats.map((chat, index) => (
            <div key={index}>{chat}</div>
          ))}
        </div>
      </div>
      <div>
        <button
          className="border-2 border-black"
          disabled={game?.creator.id !== me?.id}
          onClick={handleStart}
        >
          start
        </button>
        <button
          className="border-2 border-black"
          onClick={() =>
            navigator.clipboard.writeText(`http://localhost:3000/?game=${game?.gameId}`)
          }
        >
          invite
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
