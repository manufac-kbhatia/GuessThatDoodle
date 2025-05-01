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
  winner?: PlayerInfo;
  setWinner: Dispatch<SetStateAction<PlayerInfo | undefined>>;
}

const ContextInstance = createContext<Context | undefined>(undefined);

export function SocketContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [me, setMe] = useState<PlayerInfo>();
  const [timer, setTimer] = useState(0);
  const [winner, setWinner] = useState<PlayerInfo>();

  const [currentPlayer, setCurrentPlayer] = useState<PlayerInfo>();
  const [myTurn, setMyTurn] = useState(false);
  const [words, setWords] = useState<string[]>([]); // arrays of words from which the word has to be selected
  const [choosenWord, setChoosenWord] = useState<string | null>(null); // the selected word
  const [guessWord, setGuessWord] = useState<number[]>([]); // array of lenght of each word present in choosen word

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
        setMyTurn(false);
        setChoosenWord(null);
        setWords([]);

        setCurrentPlayer(currentPlayer);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.CHOOSING_WORD } };
        });
        setTimer(data.time as number);
      }

      if (data.type === ClientEvents.CHOOSE_WORD) {
        const words = data.words as string[];
        setChoosenWord(null);
        setWords(words);
        setMyTurn(true);
        setCurrentPlayer(me);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.CHOOSING_WORD } };
        });
        setTimer(data.time as number);
      }

      if (data.type === ClientEvents.CHOOSEN_WORD) {
        const word = data.word as string;
        setChoosenWord(word);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.GUESS_WORD } };
        });
        setTimer(data.time as number);
      }

      if (data.type === ClientEvents.GUESS_CHOOSEN_WORD) {
        const word = data.word as number[];
        setGuessWord(word);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { ...prev.gameState, state: States.GUESS_WORD } };
        });
        setTimer(data.time as number);
      }

      if (data.type === ClientEvents.TURN_END) {
        const players = data.players as Player[]; // players with updated score
        const word = data.word as string; // word which was selected
        const currentRound = data.currentRound as number; // new round
        setChoosenWord(word);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, players, gameState: { currentRound, state: States.END_TURN } };
        });
        setMyTurn(false);
        setTimer(0);
      }

      if (data.type === ClientEvents.GAMEP_END) {
        const winner = data.winner as PlayerInfo;
        setWinner(winner);
        setGame((prev) => {
          if (!prev) return null;
          return { ...prev, gameState: { currentRound: 0, state: States.GAME_END } };
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
      winner,
      setWinner
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
    winner,
    setWinner
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
