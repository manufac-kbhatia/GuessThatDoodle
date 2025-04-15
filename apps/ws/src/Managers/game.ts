import { randomUUID } from "crypto";
import { Player } from "./player";
import { GameSettings, GameState, Game as GameType } from "@repo/common/types";
import { States } from "@repo/common";

export class Game {
  public gameId: string;
  public creator: Player;
  public players: Player[];
  public gameSettings: GameSettings;
  public gameState: GameState;

  constructor(creator: Player) {
    this.creator = creator;
    this.gameId = randomUUID();
    this.players = [creator];
    this.gameSettings = {
      rounds: 3,
      totalPlayers: 10,
      drawTime: 60,
    };
    this.gameState = {
      state: States.WAITING,
      drawData: [],
      currentPlayer: 0,
      currentRound: 0,
      timerStartedAt: null,
      word: null,
    };
  }

  getGameDetails = () => {
    const game: GameType = {
      gameId: this.gameId,
      creator: this.creator.getPlayerInfo(),
      players: this.players.map((player) => player.getPlayer()),
      gameSettings: this.gameSettings,
      gameState: {
        state: this.gameState.state,
        currentRound: this.gameState.currentRound,
      },
    };

    return game;
  };
}
