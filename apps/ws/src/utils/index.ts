import { ClientEvents } from "@repo/common";
import { RawData, WebSocket } from "ws";


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