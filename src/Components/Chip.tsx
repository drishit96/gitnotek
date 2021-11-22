interface ChipProps {
  text: string;
  color: "green" | "red";
  onClickFn?: () => void;
  children: any;
}

function getBorderColor(color: "green" | "red") {
  return color === "green" ? "border-green-700" : "border-red-700";
}

function getBgColor(color: "green" | "red") {
  return color === "green" ? "bg-green-50" : "bg-red-50";
}

function getTextColor(color: "green" | "red") {
  return color === "green"
    ? "text-green-700 to-green-700"
    : "text-red-700 to-red-700";
}

const Chip = ({ text, color, onClickFn, children }: ChipProps) => {
  return (
    <button
      onClick={onClickFn}
      className={`z-10 px-2 max-w-sm border-2 ${getBorderColor(
        color
      )} ${getBgColor(color)} text-primaryColor rounded-3xl flex items-center animate-fadeInLeft`}
    >
      {children}
      <p className={`ml-1 text-sm ${getTextColor(color)}`}>{text}</p>
    </button>
  );
};

export default Chip;
