import { WebSocket } from "ws";
import {
  CreateGame,
  DrawingData,
  GuessWord,
  JoinGame,
  StartGame,
  WordSelected,
} from "../schemas";
import { Game, GameSettings, States } from "./game";
import { Player } from "./player";
import { sendError } from "../utils";
import { ClientEvents } from "../events/gamesEvents";

export const ReasonToEndGame =  {
    TIME_UP: "TIME_UP",
    ALL_PLAYERS_GUESSED: "ALL_PLAYERS_GUESSED",
} as const;

export type ReasonToEndGameType = (typeof ReasonToEndGame)[keyof typeof ReasonToEndGame];

export class GamesManager {
  private games: Map<string, Game>; // Map of gameId and the Game

  constructor() {
    this.games = new Map();
  }

  createGame = (ws: WebSocket, gameData: CreateGame) => {
    const creator = new Player(ws, gameData.playerName);
    const gameSettings: GameSettings = {
      rounds: gameData.gameSettings[0],
      totalPlayers: gameData.gameSettings[1],
      drawTime: gameData.gameSettings[2],
    };
    const game = new Game(creator, gameSettings);
    this.games.set(game.gameId, game);
    ws.send(
      JSON.stringify({
        type: ClientEvents.GAME_CREATED,
        gameId: game.gameId,
        player: creator.getPlayer(),
      })
    );
  };

  joinGame = (ws: WebSocket, data: JoinGame) => {
    const player = new Player(ws, data.playerName);
    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }
    game.players.push(player);

    game.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: ClientEvents.PLAYER_JOINED,
          players: game.players.map((player) => player.getPlayer()),
        })
      );
    });
  };

  startGame = (ws: WebSocket, data: StartGame) => {
    // Find the game
    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }
    // Check if it is ready to begin the game
    if (game.players.length < 2) {
      sendError(ws, "Atleast 2 players are required to start the game");
    }
    if (game.gameState.state !== States.NOT_STARTED) return;

    // Update the state of the game
    game.gameState.state = States.START_GAME;
    this.startNewRound(game);

  };

  startNewRound = (game: Game) =>  {
    // Get the player who will draw first
    const totalPlayers = game.players.length;
    const currentPlayerToDraw = game.players[game.gameState.currentPlayer];
    game.gameState.currentPlayer =
      (game.gameState.currentPlayer + 1) % totalPlayers;

    if (!currentPlayerToDraw) return;

    // send the words to player for selection who will draw
    currentPlayerToDraw.ws.send(
      JSON.stringify({
        type: ClientEvents.CHOOSE_WORD,
        words: ["Bee", "Car", "Tiger"],
      })
    );
    // Tell about current player to others
    game.players.forEach((player) => {
      if (player.id !== currentPlayerToDraw.id) {
        player.ws.send(
          JSON.stringify({
            type: ClientEvents.CHOOSING_WORD,
            player: currentPlayerToDraw.getPlayer(),
          })
        );
      }
    });

    game.gameState.state = States.CHOOSING_WORD;
  }

  wordSelected = (ws: WebSocket, data: WordSelected) => {
    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }
    if (game.gameState.state !== States.CHOOSING_WORD) {
      sendError(ws, "Game hasn't start yet");
      return;
    }

    game.gameState.word = data.word;
    ws.send(
      JSON.stringify({
        type: ClientEvents.CHOOSEN_WORD,
        word: data.word,
      })
    );

    game.players.forEach((player) => {
      if (player.id !== data.playerId) {
        player.ws.send(
          JSON.stringify({
            type: ClientEvents.GUESS_CHOOSEN_WORD,
            word: data.word.split(" ").map((w) => w.length),
          })
        );
      }
    });

    game.gameState.state = States.GUESS_WORD;
  };

  guessWord = (ws: WebSocket, data: GuessWord) => {
    // TODO: Check of the game is started and in guess mode
    const game = this.games.get(data.gameId);
    if (!game) {
      sendError(ws, "Game not found");
      return;
    }
    // Player who is drawing right not can't guess word
    const currentPlayer = game.players[game.gameState.currentPlayer];
    if (currentPlayer?.id === data.playerId) return;

    if (game.gameState.state !== States.GUESS_WORD) {
      game.players.forEach((player) => {
        player.ws.send(
          JSON.stringify({
            type: "GUESS",
            message: data.guessedWord, // if game state is not guess mode then treat the message send by user as a normal chat
          })
        );
      });
      return;
    }

    // check if the guessed word is correct and update the status for this player
    let message = data.guessedWord;
    if (data.guessedWord.toLowerCase() === game.gameState.word?.toLowerCase()) {
        const player = game.players.find((player) => player.id === data.playerId);
        if (!player) return;
        player.guessed = true;
        player.guessedAt = new Date;

        message = `${player.name} guesses right`;
    }

    game.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: "GUESS",
          player: player.getPlayer(),
          message,
        })
      );
    });

    // Check if all players (except the current player who have choosen the words) have guessed
    const allPlayersGuessed = game.players.every((player) => player.id !== currentPlayer?.id && player.guessed === true);
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

    // update the game state
    // send updated state
    
};

  endRound = (game: Game, reason: ReasonToEndGameType) => {

    // Clear the timer of the game
    // setup game for next round
    game.gameState.playedRounds += 1;
    if (game.gameState.playedRounds > game.gameSettings.rounds) {
        this.declareWinner();
        return;
    }
    this.givePoints();
    game.gameState.currentPlayer = 0;
    game.gameState.word = "";
    game.gameState.drawData = [];
    // allot points
    // move to next round or declare winner if rounds are finished
    this.startNewRound(game);
  };

  givePoints = () => {}
  declareWinner = () => {};
}
