import { WebSocket, WebSocketServer } from 'ws';
import { MessageTypes } from './utils/messageTypes';
import { GamesManager } from './Managers/gameManagers';

const wss = new WebSocketServer({ port: 8080 });
const Users: WebSocket[] = [];

const games = new GamesManager();

wss.on('connection', function connection(ws) {
    Users.push(ws);

    ws.on('message', async function message(data) {
      let parsedData;
      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
      } else {
        parsedData = JSON.parse(data);
      }

      const type = parsedData.type;

      if (parsedData.type === MessageTypes.JOIN_GAME) {
        const name = parsedData.userName;
        const gameId = parsedData.gameId;
      }

      if (parsedData.type === "CANVAS_UPDATE") {
          Users.forEach((user) => {
              if (user !== ws) {
                console.log("sending users");
                user.send(JSON.stringify({
                    type: "CANVAS_UPDATE",
                    canvas: parsedData.canvas
                }))
            }
        })
      }
  
    });
  
  });