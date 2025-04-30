import React from "react";
import { useAppContext } from "../app/context";
import { WordSelected, GameEvents, States } from "@repo/common";
import CanvasBoard from "./CanvasBoard";

const Drawboard = () => {
  const { socket, currentPlayer, game, words, myTurn } = useAppContext();

  const handleWordSelect = (word: string) => {
    if (!game || !currentPlayer || !socket) return;
    const data: WordSelected = {
      type: GameEvents.WORD_SELECTED,
      gameId: game.gameId,
      word,
    };
    socket.send(JSON.stringify(data));
  };
  return (
    <div className="bg-neutral-400 h-[70vh] rounded-2xl">
      {/* Settings */}
      {game?.gameState.state === States.WAITING ? <div>{JSON.stringify(game?.gameSettings)}</div> : null}
      {/* Choose Words */}
      {game?.gameState.state === States.CHOOSING_WORD && myTurn === true ? (
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
      {/* Choosing Word */}
      {game?.gameState.state === States.CHOOSING_WORD && myTurn === false ? (
        <div>{currentPlayer?.name} is choosing a word</div>
      ) : null}

      {/* Canvas draw board */}
      {game?.gameState.state === States.GUESS_WORD ? <CanvasBoard /> : null}
    </div>
  );
};

export default Drawboard;
