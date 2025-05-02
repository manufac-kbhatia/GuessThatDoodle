import { Coordinate } from "@repo/common/types";
import React from "react";
export interface AvatarType {
  avatarCoordinate: Coordinate;
  eyesCoordinate: Coordinate;
  mouthCoordinate: Coordinate;
}
const Avatar = ({ avatarCoordinate, eyesCoordinate, mouthCoordinate }: AvatarType) => {
  return (
    <>
      <div
        className="color absolute inset-0 bg-[url('/avatars-body.gif')]"
        style={{
          backgroundSize: "1000% 1000%",
          backgroundPosition: `${-100 * avatarCoordinate.x}% ${-100 * avatarCoordinate.y}%`,
        }}
      />
      <div
        className="color absolute inset-0 bg-[url('/eyes.gif')]"
        style={{
          backgroundSize: "1000% 1000%",
          backgroundPosition: `${-100 * eyesCoordinate.x}% ${-100 * eyesCoordinate.y}%`,
        }}
      />
      <div
        className="color absolute inset-0 bg-[url('/mouth.gif')]"
        style={{
          backgroundSize: "1000% 1000%",
          backgroundPosition: `${-100 * mouthCoordinate.x}% ${-100 * mouthCoordinate.y}%`,
        }}
      />
    </>
  );
};

export default Avatar;
