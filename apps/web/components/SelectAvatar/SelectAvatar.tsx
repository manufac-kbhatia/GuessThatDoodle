import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import Dice from "./Dice";
import Avatar from "../Avatar";
import { Coordinate } from "@repo/common/types";

export interface AvatarType {
  avatarCoordinate: Coordinate;
  setAvatarCoordinate: React.Dispatch<React.SetStateAction<Coordinate>>;
  eyesCoordinate: Coordinate;
  setEyesCoordinate: React.Dispatch<React.SetStateAction<Coordinate>>;
  mouthCoordinate: Coordinate;
  setMouthCoordinate: React.Dispatch<React.SetStateAction<Coordinate>>;
}
const SelectAvatar = ({
  avatarCoordinate,
  setAvatarCoordinate,
  eyesCoordinate,
  setEyesCoordinate,
  mouthCoordinate,
  setMouthCoordinate,
}: AvatarType) => {
  const handleNextAvatar = () => {
    if (avatarCoordinate.x >= 7 && avatarCoordinate.y === 2) {
      setAvatarCoordinate({ x: 0, y: 0 });
    } else if (avatarCoordinate.x < 9) {
      setAvatarCoordinate((prev) => {
        return { ...prev, x: prev.x + 1 };
      });
    } else {
      setAvatarCoordinate((prev) => {
        return { x: 0, y: prev.y + 1 };
      });
    }
  };

  const handleNextEyes = () => {
    if (eyesCoordinate.x >= 6 && eyesCoordinate.y === 5) {
      setEyesCoordinate({ x: 0, y: 0 });
    } else if (eyesCoordinate.x < 9) {
      setEyesCoordinate((prev) => {
        return { ...prev, x: prev.x + 1 };
      });
    } else {
      setEyesCoordinate((prev) => {
        return { x: 0, y: prev.y + 1 };
      });
    }
  };

  const handleNextMouth = () => {
    if (mouthCoordinate.x >= 0 && mouthCoordinate.y === 5) {
      setMouthCoordinate({ x: 0, y: 0 });
    } else if (mouthCoordinate.x < 9) {
      setMouthCoordinate((prev) => {
        return { ...prev, x: prev.x + 1 };
      });
    } else {
      setMouthCoordinate((prev) => {
        return { x: 0, y: prev.y + 1 };
      });
    }
  };

  const handlePrevAvatar = () => {
    if (avatarCoordinate.x === 0 && avatarCoordinate.y > 0) {
      setAvatarCoordinate((prev) => {
        return { x: 9, y: prev.y - 1 };
      });
    } else if (avatarCoordinate.x > 0) {
      setAvatarCoordinate((prev) => {
        return { x: prev.x - 1, y: prev.y };
      });
    } else {
      setAvatarCoordinate({ x: 7, y: 2 });
    }
  };

  const handlePrevEyes = () => {
    if (eyesCoordinate.x === 0 && eyesCoordinate.y > 0) {
      setEyesCoordinate((prev) => {
        return { x: 9, y: prev.y - 1 };
      });
    } else if (eyesCoordinate.x > 0) {
      setEyesCoordinate((prev) => {
        return { x: prev.x - 1, y: prev.y };
      });
    } else {
      setEyesCoordinate({ x: 6, y: 5 });
    }
  };

  const handlePrevMouth = () => {
    if (mouthCoordinate.x === 0 && mouthCoordinate.y > 0) {
      setMouthCoordinate((prev) => {
        return { x: 9, y: prev.y - 1 };
      });
    } else if (mouthCoordinate.x > 0) {
      setMouthCoordinate((prev) => {
        return { x: prev.x - 1, y: prev.y };
      });
    } else {
      setMouthCoordinate({ x: 0, y: 5 });
    }
  };

  function getPosition(m: number, random: number) {
    const row = Math.floor(random / m);
    const col = random % m;
    return { y: row, x: col };
  }

  const handleRandomClick = () => {
    const randomEyes = Math.floor(Math.random() * 57);
    const randomMouth = Math.floor(Math.random() * 51);
    const randomAvatar = Math.floor(Math.random() * 28);

    const eyes = getPosition(10, randomEyes);
    const mouth = getPosition(10, randomMouth);
    const avatar = getPosition(10, randomAvatar);

    setEyesCoordinate(eyes);
    setAvatarCoordinate(avatar);
    setMouthCoordinate(mouth);
  };
  return (
    <div className="flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="relative w-[5vh] h-[15vh]">
        <LeftButton onClick={handlePrevAvatar} />
        <LeftButton onClick={handlePrevEyes} />
        <LeftButton onClick={handlePrevMouth} />
      </div>
      <div className="relative w-[15vh] h-[15vh]">
        <Avatar
          avatarCoordinate={avatarCoordinate}
          eyesCoordinate={eyesCoordinate}
          mouthCoordinate={mouthCoordinate}
        />
      </div>
      <div className="relative w-[5vh] h-[15vh]">
        <RightButton onClick={handleNextAvatar} />
        <RightButton onClick={handleNextEyes} />
        <RightButton onClick={handleNextMouth} />
      </div>
      <div className="relative w-[5vh] h-[5vh] self-start">
        <Dice onClick={handleRandomClick} />
      </div>
    </div>
  );
};

export default SelectAvatar;
