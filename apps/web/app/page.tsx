"use client";

import { useAppContext } from "./context";
import GameScreen from "../components/GameScreen";
import JoinGameScreen from "../components/JoinGameScreen";
import { Suspense } from "react";

export default function Home() {
  const { game } = useAppContext();
  return game ? (
    <GameScreen />
  ) : (
    <Suspense>
      <JoinGameScreen />;
    </Suspense>
  );
}
