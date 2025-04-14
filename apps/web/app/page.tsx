"use client"

import { ClientEvents, GameEvents } from "@repo/common/events";
import { useSocketContext } from "./context/socket";
import type { CreateGame } from "@repo/common/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const {socket} = useSocketContext();
  const [name, setName] = useState("");
  const router = useRouter()

  const handleCreateGame = () => {
    if (name.length === 0)return;

    const data: CreateGame = {
      type: GameEvents.CREATE_GAME,
      gameSettings: [3, 5, 60],
      playerName: name,
    }
    socket?.send(JSON.stringify(data))
  }

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === ClientEvents.GAME_CREATED) {
        const gameId = data.gameId;
        router.push(`/${gameId}`);
      }
    }
  })

  return (
      <div>
        <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <button onClick={handleCreateGame}>Create Game</button>
        <button>Join Game</button>
      </div>
  );
}
