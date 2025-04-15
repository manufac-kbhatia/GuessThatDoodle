"use client";

import { useAppContext } from "./context";
import GameScreen from "../components/GameScreen";
import JoinGameScreen from "../components/JoinGameScreen";

export default function Home() {
  const { game } = useAppContext();
  return game ? <GameScreen /> : <JoinGameScreen />;
}
