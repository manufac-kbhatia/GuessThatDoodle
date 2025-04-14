import { State } from ".";
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


