import { randomUUID } from "crypto";
import { Player } from "./player";
import { GameSettings, GameState } from "@repo/common/types";
import { States } from "@repo/common";

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