import { GameSettings } from "@repo/common/types";
import React from "react";

const SettingOverlay = ({ settings }: { settings: GameSettings }) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4">
      <h2 className="text-3xl font-bold">Game Settings</h2>

      <div className="grid grid-cols-2 gap-4 text-xl">
        <div className="font-bold">Rounds:</div>
        <div>{settings.rounds}</div>

        <div className="font-bold">Max Players:</div>
        <div>{settings.totalPlayers}</div>

        <div className="font-bold">Draw Time (sec):</div>
        <div>{settings.drawTime}</div>

        <div className="font-bold">Word Select Time (sec):</div>
        <div>{settings.wordSelectTime}</div>
      </div>
    </div>
  );
};

export default SettingOverlay;
