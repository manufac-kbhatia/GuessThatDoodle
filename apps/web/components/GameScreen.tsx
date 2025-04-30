"use client";
import { GameEvents, StartGame, States } from "@repo/common";
import { useAppContext } from "../app/context";
import GameHeader from "./GameHeader";
import Scoreboard from "./Scoreboard";
import Chats from "./Chats";
import Drawboard from "./Drawboard";

const GameScreen = () => {
  const { game, me, socket } = useAppContext();

  const handleStart = () => {
    if (!socket || !game) return;
    const data: StartGame = {
      type: GameEvents.START_GAME,
      gameId: game.gameId,
    };
    socket.send(JSON.stringify(data));
  };

  return (
    <div className="h-screen p-16 space-y-2">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <GameHeader />
        </div>
        {/* Scoreboard */}
        <div className="col-span-2">
          <Scoreboard />
        </div>
        {/* DrawingBoard */}
        <div className="col-span-7">
          <Drawboard />
        </div>
        {/* Chats */}
        <div className="col-span-3 ">
          <Chats />
        </div>
      </div>
      {game?.gameState.state === States.NOT_STARTED ? (
        <div className="flex max-w-3xl mx-auto justify-center gap-2">
          <button
            className="flex-1 text-4xl bg-blue-400 rounded-md p-1 border-2 border-black"
            disabled={game?.creator.id !== me?.id}
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className="flex-1 text-4xl bg-green-500 rounded-md p-1 border-2 border-black"
            onClick={() =>
              navigator.clipboard.writeText(`http://localhost:3000/?game=${game?.gameId}`)
            }
          >
            Invite
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default GameScreen;
