export interface LeftButtonType {
  onClick: () => void;
}

const LeftButton = ({ onClick }: LeftButtonType) => {
  return (
    <div
      onClick={onClick}
      className="bg-[url('/arrow.gif')] w-full h-[5vh] cursor-pointer transition active:scale-50"
      style={{
        backgroundSize: "200%",
        backgroundPosition: "0% 0%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

export default LeftButton;
