"use client";
import { GameSettings } from "@repo/common/types";
import React from "react";
import { useAppContext } from "../../app/context";
import { GameEvents, StartGame } from "@repo/common";

const SettingOverlay = ({ settings }: { settings: GameSettings }) => {
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
    <div className="inset-0 absolute bg-neutral-400 p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold">Game Settings</h2>
      <div className="flex flex-col h-full justify-around">
        <div className="grid grid-cols-2 gap-4 text-xl">
          <div className="font-bold">Rounds:</div>
          <div className="text-center">{settings.rounds}</div>

          <div className="font-bold">Max Players:</div>
          <div className="text-center">{settings.totalPlayers}</div>

          <div className="font-bold">Draw Time (sec):</div>
          <div className="text-center">{settings.drawTime}</div>

          <div className="font-bold">Word Select Time (sec):</div>
          <div className="text-center">{settings.wordSelectTime}</div>
        </div>

        <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default SettingOverlay;
