import { WebSocket } from "ws";

import { Game } from "./game";
import { Player } from "./player";
import { sendError } from "../utils";
import {
  ClientEvents,
  ReasonToEndGame,
  ReasonToEndGameType,
  States,
  CreateGame,
  DrawingData,
  GuessWord,
  JoinGame,
  StartGame,
  WordSelected,
} from "@repo/common";
import { GameSettings } from "@repo/common/types";

export class GamesManager {
  private games: Map<string, Game>; // Map of gameId and the Game
  private timers: Map<string, NodeJS.Timeout>; // Map of gameId and timer running for it
  private clients: Map<WebSocket, Player>; // Map of ws and player

  constructor() {
    this.games = new Map<string, Game>();
    this.clients = new Map<WebSocket, Player>();
    this.timers = new Map<string, NodeJS.Timeout>();
  }

  createGame = (ws: WebSocket, data: CreateGame) => {
    const creator = new Player(ws, data.playerName);
    const game = new Game(creator);
    this.clients.set(ws, creator);
    this.games.set(game.gameId, game);
    // Send created game to the creator
    creator.send({
      type: ClientEvents.GAME_CREATED,
      game: game.getGameDetails(),
      me: creator.getPlayerInfo(),
    });
  };

  joinGame = (ws: WebSocket, data: JoinGame) => {
    const newPlayer = new Player(ws, data.playerName);
    this.clients.set(ws, newPlayer);

    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }

    game.addPlayer(newPlayer);
    newPlayer.send({
      type: ClientEvents.GAME_JOINED,
      game: game.getGameDetails(),
      me: newPlayer.getPlayerInfo(),
    });

    game.broadcast(
      {
        type: ClientEvents.PLAYER_JOINED,
        player: newPlayer.getPlayer(),
      },
      newPlayer,
    );
  };

  startGame = (ws: WebSocket, data: StartGame) => {
    // Find the game
    const game = this.games.get(data.gameId);
    if (!game) return;
    if (game.gameState.state !== States.WAITING) return; // TODO: Make the state check for NOT STARTED
    if (game.creator.id !== this.clients.get(ws)?.id) return;
    if (game.players.length < 2) {
      sendError(ws, "Atleast 2 players are required to start the game");
      return;
    }

    this.startNewRound(game);
  };

  private startNewRound = (game: Game) => {
    // Get the player who will draw first
    const currentPlayerToDraw = game.players[game.gameState.currentPlayer];

    if (!currentPlayerToDraw) return;

    // send the words to player for selection who will draw
    currentPlayerToDraw.send({
      type: ClientEvents.CHOOSE_WORD,
      words: ["Bee", "MasterChef", "Pussy Cat"],
    });

    // Tell about current player to others except currentPlayerToDraw
    game.broadcast(
      {
        type: ClientEvents.CHOOSING_WORD,
        player: currentPlayerToDraw.getPlayerInfo(),
      },
      currentPlayerToDraw,
    );

    game.gameState.state = States.CHOOSING_WORD;
  };

  wordSelected = (ws: WebSocket, data: WordSelected) => {
    const player = this.clients.get(ws);
    if (!player) return;
    const game = this.games.get(data.gameId);
    if (!game) return;
    if (game.gameState.state !== States.CHOOSING_WORD) return;

    game.gameState.word = data.word;
    player.send({
      type: ClientEvents.CHOOSEN_WORD,
      word: data.word,
    });

    game.broadcast(
      {
        type: ClientEvents.GUESS_CHOOSEN_WORD,
        word: data.word.split(" ").map((w) => w.length),
      },
      player,
    );

    game.updateState(States.GUESS_WORD);
  };

  guessWord = (ws: WebSocket, data: GuessWord) => {
    const player = this.clients.get(ws);
    if (!player) return;
    const game = this.games.get(data.gameId);
    if (!game) return;

    if (game.gameState.state !== States.GUESS_WORD) {
      game.broadcast({
        type: ClientEvents.GUESS,
        message: data.guessedWord, // if game state is not in guess mode then treat the message send by user as a normal chat message
        player: player.getPlayerInfo(),
      });
      return;
    }

    // Player who is drawing can't guess word
    const currentPlayer = game.players[game.gameState.currentPlayer];
    if (currentPlayer?.id === player.id) {
      currentPlayer.send({ type: ClientEvents.GUESS, message: data.guessedWord, player: player.getPlayerInfo() });
      return;
    }

    // check if the guessed word is correct and update the status for this player
    let message = data.guessedWord;
    if (data.guessedWord.toLowerCase() === game.gameState.word?.toLowerCase()) {
      player.guessed = true;
      player.guessedAt = new Date();

      message = `${player.name} guesses right`;
    }

    game.broadcast({
      type: ClientEvents.GUESS,
      player: player.getPlayerInfo(),
      message,
    });

    // Check if all players (except the current player who have choosen the words) have guessed
    const allPlayersGuessed = game.players.every(
      (player) => player.id !== currentPlayer?.id && player.guessed === true,
    );
    if (allPlayersGuessed === true) {
      this.endRound(game, ReasonToEndGame.ALL_PLAYERS_GUESSED);
    }
  };

  drawing = (ws: WebSocket, data: DrawingData) => {
    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }
    if (game.gameState.state !== States.GUESS_WORD) {
      sendError(ws, "You are not allowed to draw at this moment");
      return;
    }
    // check if the game exist and is in guess mode or not
    const player = game.players.find((player) => player.id === data.playerId);
    if (!player) {
      sendError(ws, "Player not found");
      return;
    }
    // check if the persone who is drawing is the current player or not
    const currentPlayerToDraw = game.players[game.gameState.currentPlayer];
    if (!currentPlayerToDraw) return;
    if (player.id !== currentPlayerToDraw.id) {
      sendError(ws, "It's not your turn to draw right now");
      return;
    }

    // send updated state
    game.players.forEach((player) => {
      if (player.id !== data.playerId) {
        player.ws.send(
          JSON.stringify({
            type: ClientEvents.DRAW,
            drawData: data.drawData,
          }),
        );
      }
    });
  };

  endRound = (game: Game, reason: ReasonToEndGameType) => {
    // Clear the timer of the game
    // setup game for next round
    game.gameState.currentRound += 1;
    if (game.gameState.currentRound > game.gameSettings.rounds) {
      this.declareWinner();
      return;
    }
    // Give points
    game.gameState.currentPlayer = 0;
    game.gameState.word = "";
    game.gameState.drawData = [];
    // allot points
    // move to next round or declare winner if rounds are finished
    this.startNewRound(game);
  };

  givePoints = () => {};
  declareWinner = () => {};
}
