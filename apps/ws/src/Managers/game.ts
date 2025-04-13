import { randomUUID } from "crypto";
import { Player } from "./player";

export const States =  {
    NOT_STARTED: "NOT_STARTED",
    START_GAME: "START_GAME",
    CHOOSING_WORD: "JOIN_GAME",
    GUESS_WORD: "GUESS_WORD",
} as const;

export type State = (typeof States)[keyof typeof States];

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
export class Game {
    public gameId: string;
    public creator: Player;
    public players: Player[];
    public gameSettings: GameSettings;
    public gameState: GameState;

    
    constructor(creator: Player, gameSettings: GameSettings) {
        this.creator = creator;
        this.gameId = randomUUID();
        this.players = [creator];
        this.gameSettings = gameSettings;
        this.gameState = {
            state: States.NOT_STARTED,
            drawData: [],
            currentPlayer: 0,
            currentRound: 0,
            timerStartedAt: null,
            word: null,
            playedRounds: 0,
        }
    }
}