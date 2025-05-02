"use client";

import React, { useState } from "react";
import { CreateGame, GameEvents, JoinGame } from "@repo/common";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../app/context";
import Image from "next/image";
import SelectAvatar from "./SelectAvatar/SelectAvatar";

const JoinGameScreen = () => {
  const { socket } = useAppContext();
  const [name, setName] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const params = useSearchParams();

  const [avatarCoordinate, setAvatarCoordinates] = useState({ x: 0, y: 0 });

  const handleCreateGame = () => {
    if (name.length === 0) {
      setError(true);
      return;
    }

    setError(false);
    const data: CreateGame = {
      type: GameEvents.CREATE_GAME,
      playerName: name,
    };
    socket?.send(JSON.stringify(data));
  };

  const handlePlay = () => {
    if (name.length === 0) {
      setError(true);
      return;
    }
    setError(false);
    const gameId = params.get("game");
    console.log(gameId);
    if (gameId === null) {
      // TODO: make the player join random game;
    } else {
      if (socket) {
        const data: JoinGame = {
          gameId,
          playerName: name,
          type: GameEvents.JOIN_GAME,
        };
        socket.send(JSON.stringify(data));
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image
        src="/logo.gif"
        alt="Thumbs Up"
        width={700}
        height={200}
        className="object-contain pl-16"
      />
      <div className="flex flex-col gap-5 w-full max-w-md">
        {error === true ? <div className="text-red-600 font-bold">Please enter a name</div> : null}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="p-2 text-4xl bg-white rounded-md"
        />
        <SelectAvatar />
        <button className="text-4xl text-white bg-blue-400 rounded-md" onClick={handlePlay}>
          Play!
        </button>
        <button onClick={handleCreateGame} className="text-4xl text-white bg-green-400 rounded-md">
          Create Game
        </button>
      </div>
    </div>
  );
};

export default JoinGameScreen;
