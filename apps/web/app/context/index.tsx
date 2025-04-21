import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren, JSX, Dispatch, SetStateAction } from "react";
import { WS_URL } from "../utils";
import { ClientEvents, State, States } from "@repo/common";
import { Game, GameSettings, Player, PlayerInfo } from "@repo/common/types";

export interface Message {
  message: string;
  player: PlayerInfo;
}

interface Context {
  socket: WebSocket | null;
  setSocket: Dispatch<SetStateAction<WebSocket | null>>;
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;
  me?: PlayerInfo;
  setMe: Dispatch<SetStateAction<PlayerInfo | undefined>>;
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  gameState: { state: State; currentRound: number };
  setGameState: Dispatch<SetStateAction<{ state: State; currentRound: number }>>;
  gameSettings?: GameSettings;
  setGameSettings: Dispatch<SetStateAction<GameSettings | undefined>>;
  currentPlayer?: PlayerInfo;
  setCurrentPlayer: Dispatch<SetStateAction<PlayerInfo | undefined>>;
  words: string[];
  setWords: Dispatch<SetStateAction<string[]>>;
  choosenWord: string | null;
  setChoosenWord: Dispatch<SetStateAction<string | null>>;
  guessWord: number[];
  setGuessWord: Dispatch<SetStateAction<number[]>>;
  myTurn: boolean;
  setMyTurn: Dispatch<SetStateAction<boolean>>;
}

const ContextInstance = createContext<Context | undefined>(undefined);

export function SocketContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [me, setMe] = useState<PlayerInfo>();

  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<{
    state: State;
    currentRound: number;
  }>({ state: States.WAITING, currentRound: 0 });
  const [gameSettings, setGameSettings] = useState<GameSettings>();

  const [currentPlayer, setCurrentPlayer] = useState<PlayerInfo>();
  const [myTurn, setMyTurn] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [choosenWord, setChoosenWord] = useState<string | null>(null);
  const [guessWord, setGuessWord] = useState<number[]>([]);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    setSocket(socket);

    return () => {
      socket?.close();
      setSocket(null);
    };
  }, [setSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === ClientEvents.GAME_CREATED || data.type === ClientEvents.GAME_JOINED) {
        const game = data.game as Game;
        const me = data.me as PlayerInfo;
        setGame(game);
        setMe(me);
        setPlayers(game.players);
      }

      if (data.type === ClientEvents.PLAYER_JOINED) {
        const player = data.player as Player;
        setPlayers((prev) => {
          return [...prev, player];
        });
      }

      if (data.type === ClientEvents.CHOOSING_WORD) {
        const currentPlayer = data.player as PlayerInfo;
        if (currentPlayer.id === me?.id) {
          setMyTurn(false);
          setChoosenWord(null);
        }
        setCurrentPlayer(currentPlayer);
        setGameState((prev) => {
          return { ...prev, state: States.CHOOSING_WORD };
        });
      }

      if (data.type === ClientEvents.CHOOSE_WORD) {
        const words = data.words as string[];
        setWords(words);
        setMyTurn(true);
        setCurrentPlayer(me);
        setGameState((prev) => {
          return { ...prev, state: States.CHOOSING_WORD };
        });
      }

      if (data.type === ClientEvents.CHOOSEN_WORD) {
        const word = data.word as string;
        setChoosenWord(word);
        setGameState((prev) => {
          return { ...prev, state: States.GUESS_WORD };
        });
      }

      if (data.type === ClientEvents.GUESS_CHOOSEN_WORD) {
        const word = data.word as number[];
        setGuessWord(word);
        setGameState((prev) => {
          return { ...prev, state: States.GUESS_WORD };
        });
      }
    };
  }, [me, socket]);

  const contextValue = useMemo(() => {
    return {
      socket,
      setSocket,
      game,
      setGame,
      me,
      setMe,
      players,
      setPlayers,
      gameState,
      setGameState,
      gameSettings,
      setGameSettings,
      currentPlayer,
      setCurrentPlayer,
      words,
      setWords,
      choosenWord,
      setChoosenWord,
      guessWord,
      setGuessWord,
      myTurn,
      setMyTurn,
    };
  }, [
    socket,
    setSocket,
    game,
    setGame,
    me,
    setMe,
    players,
    setPlayers,
    gameState,
    setGameState,
    gameSettings,
    setGameSettings,
    currentPlayer,
    setCurrentPlayer,
    words,
    setWords,
    choosenWord,
    setChoosenWord,
    guessWord,
    setGuessWord,
    myTurn,
    setMyTurn,
  ]);

  return <ContextInstance.Provider value={contextValue}>{children}</ContextInstance.Provider>;
}

export function useAppContext(): Context {
  const context = useContext(ContextInstance);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a ContextProvider");
  }
  return context;
}
