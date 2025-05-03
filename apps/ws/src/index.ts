import { WebSocket, WebSocketServer } from "ws";
import { parseData, sendError } from "./utils";
import { z } from "zod";
import {
  CreateGame,
  JoinGame,
  StartGame,
  GameEvents,
  ZodParsers,
  WordSelected,
  DrawingData,
  GuessWord,
  ClientEvents,
} from "@repo/common";
import { Player } from "./managers/PlayerClass";
import { Game } from "./managers/GameClass";


const wss = new WebSocketServer({ port: 8080 });

const clients = new Map<WebSocket, Player>();
const games = new Map<string, Game>();

wss.on("connection", function connection(ws) {
  ws.on("message", function message(rawData) {
    const parsedData = parseData(rawData);
    const parsedType = z.nativeEnum(GameEvents).safeParse(parsedData.type);
    if (parsedType.success === false) {
      sendError(ws, "Invalid Type");
      return;
    }
    const type = parsedType.data;

    const { data, success } = ZodParsers[type].safeParse(parsedData);
    if (success === false) {
      sendError(ws, "Invalid Input");
      return;
    }

    // create the game
    if (type === GameEvents.CREATE_GAME) {
      const { playerName, avatarBody } = data as CreateGame;
      const creator = new Player(ws, playerName, avatarBody);
      const game = new Game(creator);
      clients.set(ws, creator);
      games.set(game.gameId, game);
      // Send created game to the creator
      creator.send({
        type: ClientEvents.GAME_CREATED,
        game: game.getGameDetails(),
        me: creator.getPlayerInfo(),
      });
    }

    // join the game
    if (type === GameEvents.JOIN_GAME) {
      const { playerName, gameId, avatarBody } = data as JoinGame;
      const newPlayer = new Player(ws, playerName, avatarBody);
      clients.set(ws, newPlayer);
      const game = games.get(gameId);
      if (!game) return;
      game.joinGame(newPlayer);
    }

    const player = clients.get(ws);
    if (!player) return;

    // start the game
    if (type === GameEvents.START_GAME) {
      const { gameId } = data as StartGame;
      const game = games.get(gameId);
      if (!game) return;
      game.startGame(player);
    }

    if (type === GameEvents.WORD_SELECTED) {
      const { word, gameId } = data as WordSelected;
      const game = games.get(gameId);
      if (!game) return;
      game.wordSelected(player, word);
    }

    if (type === GameEvents.DRAW) {
      const { drawData, gameId } = data as DrawingData;
      const game = games.get(gameId);
      if (!game) return;
      game.drawing(player, drawData);
    }

    if (type === GameEvents.GUESS) {
      const { guessedWord, gameId } = data as GuessWord;
      const game = games.get(gameId);
      if (!game) return;
      game.guessWord(player, guessedWord);
    }
  });
});
