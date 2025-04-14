import { RawData, WebSocket } from "ws";
import { ClientEvents } from "../../../../packages/common/src/events";

export function parseData(data: RawData) {
  let parseData;
  if (typeof data !== "string") {
    parseData = JSON.parse(data.toString());
  } else {
    parseData = JSON.parse(data);
  }
  return parseData;
}

export function sendError(ws: WebSocket, errorMessage: string) {
    ws.send(JSON.stringify({
        type: ClientEvents.ERROR,
        error: errorMessage
    }));
}