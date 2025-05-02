import React from "react";
export interface RightButtonType {
  onClick: () => void;
}
const RightButton = ({ onClick }: RightButtonType) => {
  return (
    <div
      onClick={onClick}
      className="bg-[url('/arrow.gif')] w-full h-[5vh] cursor-pointer"
      style={{
        backgroundSize: "200%",
        backgroundPosition: "0% 100%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

export default RightButton;
