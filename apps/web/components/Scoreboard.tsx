import React from "react";
import { useAppContext } from "../app/context";
import Avatar from "./Avatar";
import Image from "next/image";

const Scoreboard = () => {
  const { game, currentPlayer } = useAppContext();
  return (
    <div className="flex flex-col bg-white rounded-md max-h-[15vh] lg:max-h-full overflow-scroll">
      {game?.players.map((player, index) => {
        const avatarCoordinate = player.avatarBody[0] ?? { x: 0, y: 0 };
        const eyesCoordinate = player.avatarBody[1] ?? { x: 0, y: 0 };
        const mouthCoordinate = player.avatarBody[2] ?? { x: 0, y: 0 };
        return (
          <div key={player.id} className={`p-1 ${index % 2 === 0 ? "bg-white" : "bg-neutral-200"}`}>
            <div className="flex gap-2">
              <div className="relative w-[5vh] h-[5vh]">
                <Avatar
                  avatarCoordinate={avatarCoordinate}
                  eyesCoordinate={eyesCoordinate}
                  mouthCoordinate={mouthCoordinate}
                />
              </div>
              <div>
                <div>
                  {player.name} {player.id === game.creator.id ? "(Admin)" : null}
                </div>
                <div>Score: {player.score}</div>
              </div>
              {currentPlayer?.id === player?.id ? (
                <div className="w-5 h-5 relative">
                  <Image src="/pencil.gif" alt="Thumbs Down" fill className="object-contain" />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
