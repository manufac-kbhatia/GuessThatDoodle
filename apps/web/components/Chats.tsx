import React, { useState } from "react";

const Chats = () => {
  const [chats] = useState<string[]>(["hi", "there"]);
  return (
    <div className="border-2 border-red-900 flex flex-col">
      {chats.map((chat, index) => (
        <div key={index}>{chat}</div>
      ))}
    </div>
  );
};

export default Chats;
