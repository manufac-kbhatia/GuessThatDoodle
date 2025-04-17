import React from "react";
import { useAppContext } from "../app/context";

const Scoreboard = () => {
  const { players, game, me } = useAppContext();
  return (
    <div className="flex flex-col bg-white rounded-md h-full overflow-hidden">
      {players.map((player, index) => {
        return (
          <div key={player.id} className={`p-1 ${index % 2 === 0 ? "bg-white" : "bg-neutral-200"}`}>
            <div>
              {player.name} {game?.creator.id === player.id ? <>(Admin)</> : null}{" "}
              {player.id === me?.id ? <>(You)</> : null}
            </div>
            <div>Score: {player.score}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
