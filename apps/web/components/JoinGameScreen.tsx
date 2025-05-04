"use client";

import React, { useState } from "react";
import { CreateGame, GameEvents, JoinGame } from "@repo/common";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../app/context";
import Image from "next/image";
import SelectAvatar from "./SelectAvatar/SelectAvatar";
import { Coordinate } from "@repo/common/types";
import Avatar from "./Avatar";

const randomPoints: { avatar: Coordinate; eye: Coordinate; mouth: Coordinate }[] = [
  {
    avatar: { x: 5, y: 2 },
    eye: { x: 1, y: 5 },
    mouth: { x: 0, y: 5 },
  },
  {
    avatar: { x: 7, y: 1 },
    eye: { x: 8, y: 0 },
    mouth: { x: 2, y: 0 },
  },
  {
    avatar: { x: 9, y: 1 },
    eye: { x: 9, y: 2 },
    mouth: { x: 5, y: 4 },
  },
  {
    avatar: { x: 5, y: 1 },
    eye: { x: 8, y: 1 },
    mouth: { x: 9, y: 3 },
  },
  {
    avatar: { x: 4, y: 0 },
    eye: { x: 2, y: 2 },
    mouth: { x: 1, y: 4 },
  },
  {
    avatar: { x: 0, y: 1 },
    eye: { x: 6, y: 3 },
    mouth: { x: 3, y: 4 },
  },
  {
    avatar: { x: 2, y: 0 },
    eye: { x: 8, y: 0 },
    mouth: { x: 5, y: 4 },
  },
];

const JoinGameScreen = () => {
  const { socket } = useAppContext();
  const [name, setName] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const params = useSearchParams();

  const [avatarCoordinate, setAvatarCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [eyesCoordinate, setEyesCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [mouthCoordinate, setMouthCoordinate] = useState<Coordinate>({ x: 0, y: 0 });

  const handleCreateGame = () => {
    if (!socket) return;
    if (name.length === 0) {
      setError(true);
      return;
    }

    setError(false);
    const data: CreateGame = {
      type: GameEvents.CREATE_GAME,
      playerName: name,
      avatarBody: [avatarCoordinate, eyesCoordinate, mouthCoordinate],
    };
    socket.send(JSON.stringify(data));
  };

  const handlePlay = () => {
    if (name.length === 0) {
      setError(true);
      return;
    } else if (name.length < 4) {
      setError(true);
      return;
    }
    setError(false);
    const gameId = params.get("game");
    if (gameId === null) {
      // TODO: make the player join random game;
    } else {
      if (socket) {
        const data: JoinGame = {
          gameId,
          playerName: name,
          type: GameEvents.JOIN_GAME,
          avatarBody: [avatarCoordinate, eyesCoordinate, mouthCoordinate],
        };
        socket.send(JSON.stringify(data));
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <Image
        src="/logo.gif"
        alt="Thumbs Up"
        width={700}
        height={200}
        className="object-contain pl-16"
      />

      <div className="flex gap-2">
        {randomPoints.map((points, index) => {
          return (
            <div key={index} className="relative w-[8vh] h-[8vh]">
              <Avatar
                avatarCoordinate={points.avatar}
                eyesCoordinate={points.eye}
                mouthCoordinate={points.mouth}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-5 w-full max-w-md">
        {error === true ? (
          <div className=" text-xl bg-red-500 p-1 rounded-md text-white font-bold">
            Please enter a name with atleat 4 characters!
          </div>
        ) : null}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="p-2 text-4xl bg-white rounded-md"
        />
        <SelectAvatar
          avatarCoordinate={avatarCoordinate}
          mouthCoordinate={mouthCoordinate}
          eyesCoordinate={eyesCoordinate}
          setAvatarCoordinate={setAvatarCoordinate}
          setEyesCoordinate={setEyesCoordinate}
          setMouthCoordinate={setMouthCoordinate}
        />
        <button
          className="text-4xl text-white bg-blue-400 rounded-md transition active:scale-95 cursor-pointer"
          onClick={handlePlay}
        >
          Play!
        </button>
        <button
          onClick={handleCreateGame}
          className="text-4xl text-white bg-green-400 rounded-md transition active:scale-95 cursor-pointer"
        >
          Create Game
        </button>
      </div>
    </div>
  );
};

export default JoinGameScreen;
