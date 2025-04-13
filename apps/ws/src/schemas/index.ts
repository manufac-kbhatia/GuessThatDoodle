import {z, ZodObject, ZodRawShape} from "zod";
import { GameEvent, GameEvents } from "../events/gamesEvents";


export const BasePayload = z.object({
    type: z.nativeEnum(GameEvents),
});

export const CreateGameSchema = BasePayload.extend({
    playerName: z.string().min(5, {message: "Please provide name of atleat 5 characters"}),
    gameSettings: z.tuple([z.number(), z.number(), z.number()])
})


export const JoinGameSchema = BasePayload.extend({
    gameId: z.string(),
    playerName: z.string().min(5, {message: "Please provide name of atleat 5 characters"}),
})

export const StartGameSchema = BasePayload.extend({
    gameId: z.string(),
})

export const LeaveGameSchema = BasePayload.extend({
    gameId: z.string(),
})

export const WordSelectedSchema = BasePayload.extend({
    word: z.string(),
    playerId: z.string(),
    gameId: z.string(),
})

export const GuessWordSchema = BasePayload.extend({
    gameId: z.string(),
    playerId: z.string(),
    playerName: z.string(),
    guessedWord: z.string(),
})

export const DrawingSchema = BasePayload.extend({
    gameId: z.string(),
    playerId: z.string(),
})

export type CreateGame = z.infer<typeof CreateGameSchema>;
export type JoinGame = z.infer<typeof JoinGameSchema>;
export type StartGame = z.infer<typeof StartGameSchema>;
export type WordSelected = z.infer<typeof WordSelectedSchema>;
export type GuessWord = z.infer<typeof GuessWordSchema>;
export type DrawingData = z.infer<typeof DrawingSchema>;

export const ZodParsers: Record<GameEvent, ZodObject<ZodRawShape>> = {
    [GameEvents.CREATE_GAME]: CreateGameSchema,
    [GameEvents.JOIN_GAME]: JoinGameSchema,
    [GameEvents.START_GAME]: StartGameSchema,
    [GameEvents.WORD_SELECTED]: WordSelectedSchema,
    
    [GameEvents.END_GAME]: StartGameSchema,
    [GameEvents.LEAVE_GAME]: StartGameSchema,
    [GameEvents.UPDATE_CANVAS]: StartGameSchema,

  };