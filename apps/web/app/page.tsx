"use client"

import { GameEvents } from "@repo/common/events";
import { useSocketContext } from "./context/socket";

export default function Home() {

  const {socket} = useSocketContext();

  const handleCreateGame = () => {
    socket?.send(JSON.stringify({
      type: GameEvents.CREATE_GAME,
    }))
  }

  return (
      <div>
        <button onClick={handleCreateGame}>Create Game</button>
        <button>Join Game</button>
      </div>
  );
}
