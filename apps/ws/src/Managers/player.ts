import { WebSocket } from "ws";
import { randomUUID } from "crypto";
import { PlayerInfo, Player as PlayerType } from "@repo/common/types";
import { ClientEvents } from "@repo/common";
export class Player {
  public id: string;
  public name: string;
  public ws: WebSocket;
  public guessed: boolean;
  public guessedAt: Date | null;
  public score: number;

  constructor(ws: WebSocket, name: string) {
    this.id = randomUUID();
    this.ws = ws;
    this.name = name;
    this.guessed = false;
    this.guessedAt = null;
    this.score = 0;
  }

  getPlayer = () => {
    const player: PlayerType = {
      id: this.id,
      name: this.name,
      score: this.score,
      guessed: this.guessed,
    };
    return player;
  };

  getPlayerInfo = () => {
    const player: PlayerInfo = {
      id: this.id,
      name: this.name,
    };
    return player;
  };

  send = (data: Record<string, any>) => {
    this.ws.send(JSON.stringify(data));
  };

  sendError = (errorMessage: string) => {
    this.ws.send(JSON.stringify({ type: ClientEvents.ERROR, errorMessage }));
  };
}
