import React, { useState } from "react";

const Chats = () => {
  const [chats, setChats] = useState<string[]>(["hi", "there"]);
  const [message, setMessage] = useState<string>("");

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.length > 0) {
      setChats((prev) => {
        return [...prev, message];
      });
    }
  };

  return (
    <div className="flex flex-col bg-white h-full justify-between overflow-hidden rounded-md">
      <div className="flex-1">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`p-2 text-md ${index % 2 === 0 ? "bg-white" : "bg-neutral-200"}`}
          >
            {chat}
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
