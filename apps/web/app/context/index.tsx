import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren, JSX, Dispatch, SetStateAction } from "react";
import { WS_URL } from "../utils";
import { ClientEvents, States } from "@repo/common";
import { Game, Player, PlayerInfo } from "@repo/common/types";

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
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
}

const ContextInstance = createContext<Context | undefined>(undefined);

export function SocketContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [me, setMe] = useState<PlayerInfo>();
  const [timer, setTimer] = useState(0);

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
      }

      if (data.type === ClientEvents.PLAYER_JOINED) {
        const player = data.player as Player;
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, players: [...prev.players, player] };
        });
      }

      if (data.type === ClientEvents.CHOOSING_WORD) {
        const currentPlayer = data.player as PlayerInfo;
        if (currentPlayer.id === me?.id) {
          setMyTurn(false);
          setChoosenWord(null);
        }
        setCurrentPlayer(currentPlayer);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.CHOOSING_WORD } };
        });
      }

      if (data.type === ClientEvents.CHOOSE_WORD) {
        const words = data.words as string[];
        setWords(words);
        setMyTurn(true);
        setCurrentPlayer(me);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.CHOOSING_WORD } };
        });
      }

      if (data.type === ClientEvents.CHOOSEN_WORD) {
        const word = data.word as string;
        setChoosenWord(word);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.GUESS_WORD } };
        });
      }

      if (data.type === ClientEvents.GUESS_CHOOSEN_WORD) {
        const word = data.word as number[];
        setGuessWord(word);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.GUESS_WORD } };
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
      timer,
      setTimer,
    };
  }, [
    socket,
    setSocket,
    game,
    setGame,
    me,
    setMe,
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
    timer,
    setTimer,
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
