import { States, ReasonToEndGame, ClientEvents, GameEvents } from "./events";
import { CreateGameSchema, DrawingSchema, GuessWordSchema, JoinGameSchema, StartGameSchema, WordSelectedSchema } from "./schemas";
import {z} from "zod";
export interface DrawData {
    x: number;
    y: number;
    color: string;
    lineWidth: number;
    end: boolean;
  }

  export interface Player {
    id: string;
    name: string;
    ws: WebSocket;
    guessed: boolean;
    guessedAt: Date | null;
    score: number;
  }

  export interface DrawData {
    x: number;
    y: number;
    color: string;
    lineWidth: number;
    end: boolean;
  }

export interface GameSettings {
    rounds: number;
    totalPlayers: number;
    drawTime: number;
}
export interface GameState {
    state: State;
    drawData: DrawData[];
    currentRound: number;
    currentPlayer: number;
    word: string | null;
    playedRounds: number;
    timerStartedAt: number | null;

}

export type CreateGame = z.infer<typeof CreateGameSchema>;
export type JoinGame = z.infer<typeof JoinGameSchema>;
export type StartGame = z.infer<typeof StartGameSchema>;
export type WordSelected = z.infer<typeof WordSelectedSchema>;
export type GuessWord = z.infer<typeof GuessWordSchema>;
export type DrawingData = z.infer<typeof DrawingSchema>;


export type State = (typeof States)[keyof typeof States];
export type ReasonToEndGameType = (typeof ReasonToEndGame)[keyof typeof ReasonToEndGame];
export type ClientEvent = (typeof ClientEvents)[keyof typeof ClientEvents];
export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];


