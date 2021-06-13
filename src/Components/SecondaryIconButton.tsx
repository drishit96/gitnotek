interface SecondaryIconButtonProps {
  id: string;
  text: string;
  onClickFn?: () => void;
  children: any;
}

const SecondaryIconButton = ({
  id,
  text,
  onClickFn,
  children,
}: SecondaryIconButtonProps) => {
  return (
    <button
      data-id={id}
      aria-label={text}
      onClick={onClickFn}
      className={`z-10 m-1 px-2 py-1 max-w-sm border-2 border-focusColor bg-transparent hover:bg-focusColor text-primaryColor rounded-3xl flex items-center`}
    >
      {children}
      <p className={`hidden ml-2 text-sm text-textColorPrimary md:block`}>
        {text}
      </p>
    </button>
  );
};

export default SecondaryIconButton;
