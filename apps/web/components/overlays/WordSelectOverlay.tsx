import Image from "next/image";
import React from "react";
export interface WordSelectOverlayType {
  onWordSelect: (word: string) => void;
  words: string[];
}
const WordSelectOverlay = ({ onWordSelect, words }: WordSelectOverlayType) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4 flex flex-col justify-center items-center">
      <div className="flex">
        <h2 className="text-3xl font-bold">Select a word to draw</h2>
        <div className="w-10 h-10 relative">
          <Image src="/pencil.gif" alt="Thumbs Down" fill className="object-contain" />
        </div>
      </div>
      <div className="flex gap-2 text-lg font-bold">
        {words.map((word) => (
          <button
            className="border-2 border-black p-2 cursor-pointer"
            key={word}
            onClick={() => onWordSelect(word)}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WordSelectOverlay;
