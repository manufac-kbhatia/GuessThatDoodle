import {z} from "zod";
import { MessageTypes } from "../utils/messageTypes";

const BasePayload = z.object({
    type: z.nativeEnum(MessageTypes),
});

const CreateGamePayload = BasePayload.extend({
    creatorName: z.string().min(5, {message: "Please provide name of atleat 5 characters"}),
})


const JoinGamePaylod = BasePayload.extend({
    gameId: z.string(),
})

const LeaveGamePaylod = BasePayload.extend({
    gameId: z.string(),
})