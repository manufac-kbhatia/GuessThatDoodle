import { Player } from "@repo/common/types";
import Avatar from "../Avatar";

export interface EndTurnType {
  choosenWord: string;
  players: Player[];
}
const EndTurnOverlay = ({ players, choosenWord }: EndTurnType) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-center">
        The word was: <span className="text-yellow-300">{choosenWord}</span>
      </h2>
      <div className="flex flex-col gap-2 text-lg font-bold">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center gap-10 ${player.guessed ? "text-green-400" : "text-black"}`}
          >
            <div className="relative w-[5vh] h-[5vh]">
              <Avatar
                avatarCoordinate={player.avatarBody[0] ?? { x: 0, y: 0 }}
                eyesCoordinate={player.avatarBody[1] ?? { x: 0, y: 0 }}
                mouthCoordinate={player.avatarBody[2] ?? { x: 0, y: 0 }}
              />
            </div>
            <div className="flex gap-2">
              <div>{player.name}</div>
              <div>{player.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndTurnOverlay;
