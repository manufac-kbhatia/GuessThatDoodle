"use client";
import { GameEvents, StartGame, States } from "@repo/common";
import { useAppContext } from "../app/context";
import GameHeader from "./GameHeader";
import Scoreboard from "./Scoreboard";
import Chats from "./Chats";
import Drawboard from "./Drawboard";

const GameScreen = () => {
  const { gameState, game, me, socket } = useAppContext();

  const handleStart = () => {
    if (!socket || !game) return;
    const data: StartGame = {
      type: GameEvents.START_GAME,
      gameId: game.gameId,
    };
    socket.send(JSON.stringify(data));
  };

  return (
    <div className="h-screen border-2 border-red-900">
      <div className="m-10 flex flex-col gap-2">
        <GameHeader />
        <div className="grid grid-cols-12 gap-2">
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
        {gameState.state === States.WAITING ? (
          <div className="flex bg-neutral-600 p-1 gap-1 text-white w-4xl rounded-md ">
            <button
              className=" flex-2/3 text-4xl bg-blue-400 rounded-md"
              disabled={game?.creator.id !== me?.id}
              onClick={handleStart}
            >
              Start
            </button>
            <button
              className=" flex-1/3 text-4xl bg-green-500 rounded-md"
              onClick={() =>
                navigator.clipboard.writeText(`http://localhost:3000/?game=${game?.gameId}`)
              }
            >
              Invite
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GameScreen;
