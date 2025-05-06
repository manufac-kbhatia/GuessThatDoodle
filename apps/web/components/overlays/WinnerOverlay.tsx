import { PlayerInfo } from "@repo/common/types";
import Avatar from "../Avatar";

const WinnerOverlay = ({ winner }: { winner: PlayerInfo }) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4 flex flex-col justify-center items-center">
      <div className="text-3xl font-bold">
        <span className="text-yellow-300 text-center">{winner?.name}</span> is the winner!
      </div>
      <div className="relative w-[10vh] h-[10vh]">
        <Avatar
          avatarCoordinate={winner.avatarBody[0] ?? { x: 0, y: 0 }}
          eyesCoordinate={winner.avatarBody[1] ?? { x: 0, y: 0 }}
          mouthCoordinate={winner.avatarBody[2] ?? { x: 0, y: 0 }}
        />
      </div>
    </div>
  );
};

export default WinnerOverlay;
