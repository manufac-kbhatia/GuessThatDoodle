// Events
export const GameEvents = {
  CREATE_GAME: "CREATE_GAME",
  JOIN_GAME: "JOIN_GAME",
  START_GAME: "START_GAME",
  END_GAME: "END_GAME",
  LEAVE_GAME: "LEAVE_GAME",
  UPDATE_CANVAS: "UPDATE_CANVAS",
  WORD_SELECTED: "WORD_SELECTED",
  DRAW: "DRAW",
} as const;

export const ClientEvents = {
  ERROR: "ERROR",
  GAME_CREATED: "GAME_CREATED",
  GAME_JOINED: "GAME_JOINED",
  PLAYER_JOINED: "PLAYER_JOINED",
  CHOOSE_WORD: "CHOOSE_WORD",
  CHOOSING_WORD: "CHOOSING_WORD",
  CHOOSEN_WORD: "CHOOSEN_WORD",
  GUESS_CHOOSEN_WORD: "GUESS_CHOOSEN_WORD",
  DRAW: "DRAW",
} as const;

export const ReasonToEndGame = {
  TIME_UP: "TIME_UP",
  ALL_PLAYERS_GUESSED: "ALL_PLAYERS_GUESSED",
} as const;

export const States = {
  WAITING: "WAITING",
  CHOOSING_WORD: "CHOOSING WORD",
  GUESS_WORD: "GUESS",
} as const;

export type State = (typeof States)[keyof typeof States];
export type ReasonToEndGameType = (typeof ReasonToEndGame)[keyof typeof ReasonToEndGame];
export type ClientEvent = (typeof ClientEvents)[keyof typeof ClientEvents];
export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];

// Schemas
import { z, ZodObject, type ZodRawShape } from "zod";

export const BasePayload = z.object({
  type: z.nativeEnum(GameEvents),
});

export const CreateGameSchema = BasePayload.extend({
  playerName: z.string().min(5, { message: "Please provide name of atleat 5 characters" }),
});

export const JoinGameSchema = BasePayload.extend({
  gameId: z.string(),
  playerName: z.string().min(5, { message: "Please provide name of atleat 5 characters" }),
});

export const StartGameSchema = BasePayload.extend({
  gameId: z.string(),
});

export const LeaveGameSchema = BasePayload.extend({
  gameId: z.string(),
});

export const WordSelectedSchema = BasePayload.extend({
  word: z.string(),
  playerId: z.string(),
  gameId: z.string(),
});

export const GuessWordSchema = BasePayload.extend({
  gameId: z.string(),
  playerId: z.string(),
  playerName: z.string(),
  guessedWord: z.string(),
});

export const DrawingSchema = BasePayload.extend({
  gameId: z.string(),
  playerId: z.string(),
  drawData: z.object({
    x: z.number(),
    y: z.number(),
    color: z.string(),
    lineWidth: z.number(),
    end: z.boolean(),
  }),
});

export const ZodParsers: Record<GameEvent, ZodObject<ZodRawShape>> = {
  [GameEvents.CREATE_GAME]: CreateGameSchema,
  [GameEvents.JOIN_GAME]: JoinGameSchema,
  [GameEvents.START_GAME]: StartGameSchema,
  [GameEvents.WORD_SELECTED]: WordSelectedSchema,
  [GameEvents.DRAW]: DrawingSchema,

  [GameEvents.END_GAME]: StartGameSchema,
  [GameEvents.LEAVE_GAME]: StartGameSchema,
  [GameEvents.UPDATE_CANVAS]: StartGameSchema,
};

export type CreateGame = z.infer<typeof CreateGameSchema>;
export type JoinGame = z.infer<typeof JoinGameSchema>;
export type StartGame = z.infer<typeof StartGameSchema>;
export type WordSelected = z.infer<typeof WordSelectedSchema>;
export type GuessWord = z.infer<typeof GuessWordSchema>;
export type DrawingData = z.infer<typeof DrawingSchema>;
