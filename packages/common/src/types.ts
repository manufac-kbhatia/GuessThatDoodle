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
  guessed: boolean;
  score: number;
  avatarBody: Coordinate[];
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
  wordSelectTime: number;
}
export interface GameState {
  state: State;
  drawData: DrawData[];
  currentRound: number;
  currentPlayer: number;
  word: string | null;
  timerStartedAt: Date | null;
}

export interface Game {
  gameId: string;
  creator: PlayerInfo;
  players: Player[];
  gameSettings: GameSettings;
  gameState: {
    state: State;
    currentRound: number;
  };
}

export interface PlayerInfo {
  id: string;
  name: string;
}

export interface Coordinate {
  x: number;
  y: number;
}
