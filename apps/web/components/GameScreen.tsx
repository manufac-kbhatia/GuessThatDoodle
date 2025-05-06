import GameHeader from "./GameHeader";
import Scoreboard from "./Scoreboard";
import Chats from "./Chats";
import Drawboard from "./Drawboard";

const GameScreen = () => {
  return (
    <div className="h-screen lg:p-8">
      <div className="grid grid-cols-12 gap-2 ">
      <div className="col-span-12">
        <GameHeader />
      </div>

      <div className="col-span-12 lg:col-span-8 lg:order-1">
        <Drawboard />
      </div>
      
      <div className="col-span-6 lg:col-span-2">
        <Scoreboard />
      </div>
      
      <div className="col-span-6 lg:col-span-2 lg:order-2">
        <Chats />
      </div>
    </div>
    </div>
  );
};

export default GameScreen;