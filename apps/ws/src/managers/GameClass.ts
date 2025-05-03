import { randomUUID } from "crypto";
import { Player } from "./PlayerClass";
import { DrawData, GameSettings, GameState, Game as GameType } from "@repo/common/types";
import { ClientEvents, State, States } from "@repo/common";
import { getWords } from "../utils";

export class Game {
  public gameId: string;
  public creator: Player;
  public players: Player[];
  public gameSettings: GameSettings;
  public gameState: GameState;
  public timer: NodeJS.Timeout | null;

  constructor(creator: Player) {
    this.creator = creator;
    this.gameId = randomUUID();
    this.players = [creator];
    this.timer = null;
    this.gameSettings = {
      rounds: 3,
      totalPlayers: 10,
      drawTime: 60,
      wordSelectTime: 10,
    };
    this.gameState = {
      state: States.NOT_STARTED,
      drawData: [],
      currentPlayer: 0,
      currentRound: 1,
      timerStartedAt: null,
      word: null,
    };
  }

  joinGame = (newPlayer: Player) => {
    // Add the new the player in the players list
    this.players.push(newPlayer);

    // Send game joined event to the new player
    newPlayer.send({
      type: ClientEvents.GAME_JOINED,
      game: this.getGameDetails(),
      me: newPlayer.getPlayerInfo(),
    });

    // Send the player joined event to all players of this game except the player who joined
    this.broadcast(
      {
        type: ClientEvents.PLAYER_JOINED,
        player: newPlayer.getPlayer(),
      },
      newPlayer,
    );
  };

  startGame = (player: Player) => {
    // Check if the player who requested to start the game is the creator or not
    if (this.creator.id !== player.id) return;
    // Check if there are atleast two players to start the game
    if (this.players.length < 2) {
      player.sendError("Atleast 2 players are required to start the game");
      return;
    }
    // Start the turn
    this.updateState(States.CHOOSING_WORD);
    this.nextTurn();
  };

  nextTurn = () => {
    // Get the current player who will draw first
    const currentPlayerToDraw = this.players[this.gameState.currentPlayer];
    if (!currentPlayerToDraw) return;

    // send the words to current player for selecting one of them
    const words = getWords();
    currentPlayerToDraw.send({
      type: ClientEvents.CHOOSE_WORD,
      words,
      time: this.gameSettings.wordSelectTime,
    });

    // Send choosing word event to other players in the room
    this.broadcast(
      {
        type: ClientEvents.CHOOSING_WORD,
        player: currentPlayerToDraw.getPlayerInfo(),
        time: this.gameSettings.wordSelectTime,
      },
      currentPlayerToDraw,
    );

    // Run a timer to select a random word if a word is not selected within give time: wordSelectTime
    const timer = setTimeout(() => {
      const randomWord = words[Math.floor(Math.random() * words.length)] as string;
      this.wordSelected(currentPlayerToDraw, randomWord);
    }, this.gameSettings.wordSelectTime * 1000);
    this.setTimer(timer);
  };

  wordSelected = (player: Player, word: string) => {
    // Check if the word is selected by current player or not
    const currentPlayerToDraw = this.players[this.gameState.currentPlayer];
    if (!currentPlayerToDraw || currentPlayerToDraw.id !== player.id) return;

    // Clear the running timer and set the word
    this.clearTimer();
    this.gameState.state = States.GUESS_WORD;
    this.gameState.word = word;
    this.gameState.timerStartedAt = new Date();

    // Send the word choosen event with draw time to the current payer to draw
    currentPlayerToDraw.send({
      type: ClientEvents.CHOOSEN_WORD,
      word,
      time: this.gameSettings.drawTime,
    });

    // Send guess choosen word event to all other players
    this.broadcast(
      {
        type: ClientEvents.GUESS_CHOOSEN_WORD,
        word: word.split(" ").map((w) => w.length),
        time: this.gameSettings.drawTime,
      },
      currentPlayerToDraw,
    );

    const timer = setTimeout(() => {
      this.endTurn();
    }, this.gameSettings.drawTime * 1000);
    this.setTimer(timer);
  };

  guessWord = (player: Player, guessedWord: string) => {
    if (this.gameState.state !== States.GUESS_WORD) {
      this.broadcast({
        type: ClientEvents.GUESS,
        message: guessedWord, // if game state is not in guess mode then treat the message send by user as a normal chat message
        player: player.getPlayerInfo(),
      });
      return;
    }

    // Player who is drawing can't guess word
    const currentPlayer = this.players[this.gameState.currentPlayer];
    if (currentPlayer?.id === player.id) {
      currentPlayer.send({ type: ClientEvents.GUESS, message: guessedWord, player: player.getPlayerInfo() });
      return;
    }

    // check if the guessed word is correct and update the status for this player
    let message = guessedWord;
    if (guessedWord.toLowerCase() === this.gameState.word?.toLowerCase() && player.guessed === false) {
      player.guessed = true;
      player.guessedAt = new Date();
      message = `${player.name} guesses right`;
    }

    this.broadcast({
      type: ClientEvents.GUESS,
      player: player.getPlayerInfo(),
      message,
    });

    // Check if all players except the current player ,have guessed
    const allPlayersGuessed = this.players.every((player) => player.guessed || player.id === currentPlayer?.id);
    if (allPlayersGuessed === true) {
      3;
      this.endTurn();
    }
  };

  drawing = (player: Player, drawData: DrawData) => {
    if (this.gameState.state !== States.GUESS_WORD) {
      player.sendError("You are not allowed to draw at this moment");
      return;
    }

    // check if the persone who is drawing is the current player or not
    const currentPlayerToDraw = this.players[this.gameState.currentPlayer];
    if (!currentPlayerToDraw) return;
    if (player.id !== currentPlayerToDraw.id) {
      player.sendError("It's not your turn to draw right now");
      return;
    }

    // send updated drawing
    this.broadcast(
      {
        type: ClientEvents.DRAW,
        drawData,
      },
      player,
    );
  };

  endTurn = () => {
    // Clear the timer of the game
    this.clearTimer();
    this.givePoints();
    this.gameState.state = States.END_TURN;
    this.gameState.currentPlayer += 1;

    if (this.gameState.currentPlayer === this.players.length) {
      this.gameState.currentPlayer = 0;
      this.gameState.currentRound += 1;
    }

    const endRoundTime = 5; // This means that the next round or turn will start after 5 seconds.
    this.broadcast({
      type: ClientEvents.TURN_END,
      word: this.gameState.word,
      players: this.players.map((player) => player.getPlayer()),
      currentRound: this.gameState.currentRound,
    });

    this.gameState.word = "";
    this.gameState.state = States.CHOOSING_WORD;
    this.players.forEach((player) => {
      player.guessed = false;
      player.guessedAt = null;
    });

    // play next turn
    setTimeout(() => {
      if (this.gameState.currentRound > this.gameSettings.rounds) this.endGame();
      else this.nextTurn();
    }, endRoundTime * 1000);
  };

  givePoints = () => {
    const playersWhoGuessed = this.players.filter((player) => player.guessed);
    const timerStartedAt = this.gameState.timerStartedAt ?? new Date();
    playersWhoGuessed.forEach((player) => {
      if (player.guessed && player.guessedAt) {
        const points = 200;
        const guessTime = Math.abs((timerStartedAt.getTime() - player.guessedAt.getTime()) / 1000);
        player.score += Math.round(Math.max(points - guessTime, 0));
      }

      const currentPlayer = this.players[this.gameState.currentPlayer];
      if (!currentPlayer) return;
      currentPlayer.score += 50 + playersWhoGuessed.length * 10;
    });
  };

  endGame = () => {
    this.updateState(States.GAME_END);
    const winner = this.players.reduce((max, player) => (player.score > max.score ? player : max));
    this.broadcast({ type: ClientEvents.GAMEP_END, winner: winner.getPlayerInfo() });
  };

  getGameDetails = () => {
    const game: GameType = {
      gameId: this.gameId,
      creator: this.creator.getPlayerInfo(),
      players: this.players.map((player) => player.getPlayer()),
      gameSettings: this.gameSettings,
      gameState: {
        state: this.gameState.state,
        currentRound: this.gameState.currentRound,
      },
    };
    return game;
  };

  broadcast = (data: Record<string, any>, except?: Player) => {
    const broadcastTo = this.players.filter((p) => p.id !== except?.id);
    broadcastTo.forEach((player) => {
      player.send(data);
    });
  };

  updateState = (state: State) => {
    this.gameState.state = state;
  };

  setTimer = (timer: NodeJS.Timeout) => {
    this.clearTimer();
    this.timer = timer;
  };

  clearTimer = () => {
    if (this.timer !== null) clearTimeout(this.timer);
  };
}
