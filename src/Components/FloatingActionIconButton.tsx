interface ButtonProps {
  text: string;
  onClickFn?: () => void;
  children: any;
}

const FloatingActionIconButton = ({
  text,
  onClickFn,
  children,
}: ButtonProps) => {
  return (
    <button
      onClick={onClickFn}
      className="z-10 p-3 max-w-sm fixed bottom-0 right-0 mx-8 my-8 hover:shadow-xl text-white bg-primaryColor rounded-3xl shadow-md flex items-center"
    >
      {children}
      <p className="ml-2 text-base">{text}</p>
    </button>
  );
};

export default FloatingActionIconButton;
