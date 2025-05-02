import { ClientEvents } from "@repo/common";
import { RawData, WebSocket } from "ws";
import { readFileSync } from "fs";
import path from "path";

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
  ws.send(
    JSON.stringify({
      type: ClientEvents.ERROR,
      error: errorMessage,
    }),
  );
}

export function getWords() {
  const words = readFileSync(path.join(process.cwd(), "words.txt"), "utf-8")
    .split("\n")
    .map((word) => word.trim())
    .filter(Boolean);

  const randomWords = [];
  while (randomWords.length < 3 && words.length > 0) {
    const index = Math.floor(Math.random() * words.length);
    randomWords.push(words.splice(index, 1)[0]);
  }

  return randomWords;
}
