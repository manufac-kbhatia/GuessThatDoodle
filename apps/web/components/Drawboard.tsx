import React from "react";
import { useAppContext } from "../app/context";
import { WordSelected, GameEvents, States } from "@repo/common";
import CanvasBoard from "./CanvasBoard";
import SettingOverlay from "./overlays/SettingOverlay";
import WordSelectOverlay from "./overlays/WordSelectOverlay";
import ChoosingWordOverlay from "./overlays/ChoosingWordOverlay";
import EndTurnOverlay from "./overlays/EndTurnOverlay";
import WinnerOverlay from "./overlays/WinnerOverlay";

const Drawboard = () => {
  const { socket, currentPlayer, game, words, myTurn, choosenWord, winner } = useAppContext();

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
    <div className="relative bg-neutral-400 h-[70vh] rounded-md">
      {/* Settings */}
      {game?.gameState.state === States.NOT_STARTED ? (
        <SettingOverlay settings={game.gameSettings} />
      ) : null}
      {/* Choose Words */}
      {game?.gameState.state === States.CHOOSING_WORD && myTurn === true ? (
        <WordSelectOverlay words={words} onWordSelect={handleWordSelect} />
      ) : null}
      {/* Choosing Word */}
      {game?.gameState.state === States.CHOOSING_WORD && myTurn === false ? (
        <ChoosingWordOverlay currentPlayer={currentPlayer} />
      ) : null}
      {/* Turn Ends */}
      {game?.gameState.state === States.END_TURN && choosenWord ? (
        <EndTurnOverlay choosenWord={choosenWord} players={game.players} />
      ) : null}
      {game?.gameState.state === States.GAME_END && winner ? (
        <WinnerOverlay winner={winner} />
      ) : null}

      {/* Canvas draw board */}
      {game?.gameState.state === States.GUESS_WORD ? <CanvasBoard /> : null}
    </div>
  );
};

export default Drawboard;
