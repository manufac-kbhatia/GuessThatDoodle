import React from "react";
import { useAppContext } from "../app/context";

const Scoreboard = () => {
  const { players, game, me } = useAppContext();
  return (
    <div className="flex flex-col">
      {players.map((player) => {
        return (
          <div key={player.id} className="flex flex-col">
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
  );
};

export default Scoreboard;
