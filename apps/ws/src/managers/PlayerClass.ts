import { WebSocket } from "ws";
import { randomUUID } from "crypto";
import { Coordinate, PlayerInfo, Player as PlayerType } from "@repo/common/types";
import { ClientEvents } from "@repo/common";
export class Player {
  public id: string;
  public name: string;
  public avatarBody: Coordinate[];
  public ws: WebSocket;
  public guessed: boolean;
  public guessedAt: Date | null;
  public score: number;

  constructor(ws: WebSocket, name: string, avatarBody: Coordinate[]) {
    this.id = randomUUID();
    this.ws = ws;
    this.name = name;
    this.guessed = false;
    this.guessedAt = null;
    this.score = 0;
    this.avatarBody = avatarBody;
  }

  getPlayer = () => {
    const player: PlayerType = {
      id: this.id,
      name: this.name,
      score: this.score,
      guessed: this.guessed,
      avatarBody: this.avatarBody,
    };
    return player;
  };

  getPlayerInfo = () => {
    const player: PlayerInfo = {
      id: this.id,
      name: this.name,
      avatarBody: this.avatarBody,
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
