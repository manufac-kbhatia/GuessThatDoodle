import { Player } from "@repo/common/types";

export interface EndTurnType {
  choosenWord: string;
  players: Player[];
}
const EndTurnOverlay = ({ players, choosenWord }: EndTurnType) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold">The word was: {choosenWord}</h2>
      <div className="flex flex-col gap-2 text-lg font-bold">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex gap-5 ${player.guessed ? "text-green-400" : "text-black"}`}
          >
            <div>{player.name}</div>
            <div>{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndTurnOverlay;
