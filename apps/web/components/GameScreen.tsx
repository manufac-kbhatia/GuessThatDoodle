import GameHeader from "./GameHeader";
import Scoreboard from "./Scoreboard";
import Chats from "./Chats";
import Drawboard from "./Drawboard";

const GameScreen = () => {
  return (
    <div className="h-screen p-8">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <GameHeader />
        </div>
        {/* Scoreboard */}
        <div className="col-span-2">
          <Scoreboard />
        </div>
        {/* DrawingBoard */}
        <div className="col-span-8">
          <Drawboard />
        </div>
        {/* Chats */}
        <div className="col-span-2">
          <Chats />
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
