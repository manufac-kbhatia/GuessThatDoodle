import { WebSocket } from "ws";
import { randomUUID } from "crypto";

export class Player {
    public id: string;
    public name: string;
    public ws: WebSocket;
    public guessed: boolean;
    public guessedAt: Date | null;
    public score: number;

    constructor(ws: WebSocket, name: string) {
        this.id = randomUUID()
        this.ws = ws;
        this.name = name;
        this.guessed = false;
        this.guessedAt = null;
        this.score = 0;
    }

    getPlayer() {
        const player = {
            id: this.id,
            name: this.name,
            score: this.score,
            guessed: this.guessed
        }
        return player;
    }
}