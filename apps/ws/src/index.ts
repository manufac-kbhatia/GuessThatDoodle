import { WebSocketServer } from 'ws';
import { GamesManager } from './managers/gameManagers';
import { parseData, sendError } from './utils';
import { GameEvents } from './events/gamesEvents';
import { z } from 'zod';
import { CreateGame, JoinGame, StartGame, ZodParsers } from './schemas';

const wss = new WebSocketServer({ port: 8080 });

const games = new GamesManager();

wss.on('connection', function connection(ws) {

   ws.on("message", function message(rawData) {
        const parsedData = parseData(rawData);
        const parsedType = z.nativeEnum(GameEvents).safeParse(parsedData.type);
        if(parsedType.success === false) {
            sendError(ws, "Invalid Input");
            return;
        }
        const type = parsedType.data;

        const {data, success} = ZodParsers[type].safeParse(parsedData);
        if (success === false) {
            sendError(ws, "Invalid Input");
            return;
        }

        if(type === GameEvents.CREATE_GAME) {
            games.createGame(ws, data as CreateGame);
        }

        if (type === GameEvents.JOIN_GAME) {
            games.joinGame(ws, data as JoinGame)
        }

        if (type === GameEvents.START_GAME) {
            games.startGame(ws, data as StartGame)
        }
   })
  });