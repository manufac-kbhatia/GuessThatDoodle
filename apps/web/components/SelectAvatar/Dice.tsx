export interface DiceType {
  onClick: () => void;
}
const Dice = ({ onClick }: DiceType) => {
  return (
    <div
      onClick={onClick}
      className="bg-[url('/dice.gif')] w-full h-[5vh] cursor-pointer"
      style={{
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

export default Dice;
