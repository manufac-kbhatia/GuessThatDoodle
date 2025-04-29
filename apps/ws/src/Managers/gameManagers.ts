// import { WebSocket } from "ws";

// import { Game } from "./game";
// import { Player } from "./player";
// import { sendError } from "../utils";
// import {
//   ClientEvents,
//   States,
//   CreateGame,
//   DrawingData,
//   GuessWord,
//   JoinGame,
//   StartGame,
//   WordSelected,
//   ReasonToEndTurnType,
//   ReasonToEndTurn,
// } from "@repo/common";
// import { GameSettings } from "@repo/common/types";

// export class GamesManager {
//   private games: Map<string, Game>; // Map of gameId and the Game

//   constructor() {
//     this.games = new Map<string, Game>();
//   }

//   // createGame = (creator: Player) => {
//   //   const game = new Game(creator);
//   //   this.games.set(game.gameId, game);
//   //   // Send created game to the creator
//   //   creator.send({
//   //     type: ClientEvents.GAME_CREATED,
//   //     game: game.getGameDetails(),
//   //     me: creator.getPlayerInfo(),
//   //   });
//   // };

//   // joinGame = (newPlayer: Player, data: JoinGame) => {
//   //   const game = this.games.get(data.gameId);
//   //   if (!game) {
//   //     newPlayer.sendError("Game not found");
//   //     return;
//   //   }

//   //   game.addPlayer(newPlayer);
//   //   newPlayer.send({
//   //     type: ClientEvents.GAME_JOINED,
//   //     game: game.getGameDetails(),
//   //     me: newPlayer.getPlayerInfo(),
//   //   });

//   //   game.broadcast(
//   //     {
//   //       type: ClientEvents.PLAYER_JOINED,
//   //       player: newPlayer.getPlayerInfo(),
//   //     },
//   //     newPlayer,
//   //   );
//   // };

//   // startGame = (player: Player, data: StartGame) => {
//   //   // Find the game
//   //   const game = this.games.get(data.gameId);
//   //   if (!game) return;
//   //   if (game.gameState.state !== States.NOT_STARTED) return; // TODO: Make the state check for NOT STARTED
//   //   if (game.creator.id !== player.id) return;
//   //   if (game.players.length < 2) {
//   //     player.sendError("Atleast 2 players are required to start the game");
//   //     return;
//   //   }

//   //   game.updateState(States.CHOOSING_WORD);
//   //   this.nextTurn(player, game);
//   // };

//   private nextTurn = (player: Player, game: Game) => {
//     // Get the player who will draw first
//     const currentPlayerToDraw = game.players[game.gameState.currentPlayer];
//     if (!currentPlayerToDraw) return;

//     // send the words to player for selection who will draw
//     const words = ["Bee", "MasterChef", "Pussy Cat"];
//     currentPlayerToDraw.send({
//       type: ClientEvents.CHOOSE_WORD,
//       words,
//       time: game.gameSettings.wordSelectTime,
//     });

//     // Send choosing word event to other players in the room
//     game.broadcast(
//       {
//         type: ClientEvents.CHOOSING_WORD,
//         player: currentPlayerToDraw.getPlayerInfo(),
//         time: game.gameSettings.wordSelectTime,
//       },
//       currentPlayerToDraw,
//     );

//     // Run a timer to select random word if word not selected within give time wordSelectTime
//     const timer = setTimeout(() => {
//       if (game.gameState.word !== "") return;
//       const randomWord = words[Math.floor(Math.random() * words.length)] as string;
//       this.wordSelected(player, { type: "WORD_SELECTED", gameId: game.gameId, word: randomWord });
//     }, game.gameSettings.wordSelectTime * 1000);
//     game.setTimer(timer);
//   };

//   wordSelected = (player: Player, data: WordSelected) => {
//     const game = this.games.get(data.gameId);
//     if (!game) return;
//     if (game.gameState.state !== States.CHOOSING_WORD) return;

//     game.clearTimer();
//     game.updateState(States.GUESS_WORD);
//     game.gameState.word = data.word;

//     player.send({
//       type: ClientEvents.CHOOSEN_WORD,
//       word: data.word,
//       time: game.gameSettings.drawTime,
//     });

//     game.broadcast(
//       {
//         type: ClientEvents.GUESS_CHOOSEN_WORD,
//         word: data.word.split(" ").map((w) => w.length),
//         time: game.gameSettings.drawTime,
//       },
//       player,
//     );

//     const timer = setTimeout(() => {
//       this.endTurn(game, ReasonToEndTurn.TIME_UP);
//     }, game.gameSettings.drawTime * 1000);
//     game.setTimer(timer);
//   };

//   guessWord = (player: Player, data: GuessWord) => {
//     const game = this.games.get(data.gameId);
//     if (!game) return;

//     if (game.gameState.state !== States.GUESS_WORD) {
//       game.broadcast({
//         type: ClientEvents.GUESS,
//         message: data.guessedWord, // if game state is not in guess mode then treat the message send by user as a normal chat message
//         player: player.getPlayerInfo(),
//       });
//       return;
//     }

//     // Player who is drawing can't guess word
//     const currentPlayer = game.players[game.gameState.currentPlayer];
//     if (currentPlayer?.id === player.id) {
//       currentPlayer.send({ type: ClientEvents.GUESS, message: data.guessedWord, player: player.getPlayerInfo() });
//       return;
//     }

//     // check if the guessed word is correct and update the status for this player
//     let message = data.guessedWord;
//     if (data.guessedWord.toLowerCase() === game.gameState.word?.toLowerCase()) {
//       player.guessed = true;
//       player.guessedAt = new Date();

//       message = `${player.name} guesses right`;
//     }

//     game.broadcast({
//       type: ClientEvents.GUESS,
//       player: player.getPlayerInfo(),
//       message,
//     });

//     // Check if all players (except the current player who have choosen the words) have guessed
//     const allPlayersGuessed = game.players.every(
//       (player) => player.id !== currentPlayer?.id && player.guessed === true,
//     );
//     if (allPlayersGuessed === true) {
//       this.endTurn(game, ReasonToEndTurn.ALL_PLAYERS_GUESSED);
//     }
//   };

//   drawing = (player: Player, data: DrawingData) => {
//     const game = this.games.get(data.gameId);
//     if (!game) {
//       player.sendError("Game not found");
//       return;
//     }
//     if (game.gameState.state !== States.GUESS_WORD) {
//       player.sendError("You are not allowed to draw at this moment");
//       return;
//     }

//     // check if the persone who is drawing is the current player or not
//     const currentPlayerToDraw = game.players[game.gameState.currentPlayer];
//     if (!currentPlayerToDraw) return;
//     if (player.id !== currentPlayerToDraw.id) {
//       player.sendError("It's not your turn to draw right now");
//       return;
//     }

//     // send updated drawing
//     game.broadcast(
//       {
//         type: ClientEvents.DRAW,
//         drawData: data.drawData,
//       },
//       player,
//     );
//   };

//   endTurn = (game: Game, reason: ReasonToEndTurnType) => {
//     // Clear the timer of the game
//     game.clearTimer();
//     // setup game for next round
//     game.gameState.currentRound += 1;
//     if (game.gameState.currentRound > game.gameSettings.rounds) {
//       this.declareWinner();
//       return;
//     }
//     // Give points
//     game.gameState.currentPlayer = 0;
//     game.gameState.word = "";
//     game.gameState.drawData = [];
//     // allot points
//     // move to next round or declare winner if rounds are finished
//     // this.startNewRound(game);
//   };

//   givePoints = () => {};
//   declareWinner = () => {};
// }
