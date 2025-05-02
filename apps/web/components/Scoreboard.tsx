import React from "react";
import { useAppContext } from "../app/context";
import Avatar from "./Avatar";

const Scoreboard = () => {
  const { game, me } = useAppContext();
  return (
    <div className="flex flex-col bg-white rounded-md h-full overflow-hidden">
      {game?.players.map((player, index) => {
        const avatarCoordinate = player.avatarBody[0] ?? { x: 0, y: 0 };
        const eyesCoordinate = player.avatarBody[1] ?? { x: 0, y: 0 };
        const mouthCoordinate = player.avatarBody[2] ?? { x: 0, y: 0 };
        return (
          <div key={player.id} className={`p-1 ${index % 2 === 0 ? "bg-white" : "bg-neutral-200"}`}>
            <div className="flex justify-between">
              <div>
                {player.name} {"  "}
                {player.id === me?.id ? <>(You)</> : null}
                <div>Score: {player.score}</div>
              </div>
              <div className="relative w-[5vh] h-[5vh]">
                <Avatar
                  avatarCoordinate={avatarCoordinate}
                  eyesCoordinate={eyesCoordinate}
                  mouthCoordinate={mouthCoordinate}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
