import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../app/context";
import { ClientEvents, GameEvents, GuessWord } from "@repo/common";
import { PlayerInfo } from "@repo/common/types";

export interface Message {
  message: string;
  player: PlayerInfo;
}
const Chats = () => {
  const { socket, game } = useAppContext();
  const [chats, setChats] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);


  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!game || !socket) return;
    if (event.key === "Enter" && message.length > 0) {
      const data: GuessWord = {
        type: GameEvents.GUESS,
        gameId: game.gameId,
        guessedWord: message,
      };
      socket.send(JSON.stringify(data));
      setMessage("");
    }
  };

  const updateMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === ClientEvents.GUESS) {
      const player = data.player as PlayerInfo;
      const message = data.message as string;
      setChats((prev) => {
        return [...prev, { message, player }];
      });
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener("message", updateMessage);

    return () => {
      socket.removeEventListener("message", updateMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (containerRef.current) {
      const lastMessage = containerRef.current.lastElementChild;
      if (lastMessage) {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: "smooth",
          block: "end",
        };
        lastMessage.scrollIntoView(scrollOptions);
      }
    }
  }, [chats]);

  return (
    <div className="flex flex-col bg-white h-full justify-between rounded-md">
      <div className="flex-1 overflow-scroll max-h-[60vh]" ref={containerRef}>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`p-2 text-md ${index % 2 === 0 ? "bg-white" : "bg-neutral-200"}`}
          >
            {chat.player.name} : {chat.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type you guess here..."
        className="m-1 border-[1px] border-black rounded-md p-1"
        onKeyDown={handleEnter}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
    </div>
  );
};

export default Chats;
