enum AnimateDirection {
  leftToRight,
  rightToLeft
}

interface SecondaryIconButtonProps {
  id: string;
  text: string;
  hideText?: boolean;
  isDarkBackground?: boolean;
  animate?: AnimateDirection;
  onClickFn?: () => void;
  children: any;
}

const SecondaryIconButton = ({
  id,
  text,
  hideText,
  isDarkBackground,
  animate,
  onClickFn,
  children,
}: SecondaryIconButtonProps) => {
  return (
    <button
      data-id={id}
      aria-label={text}
      onClick={onClickFn}
      className={`z-10 m-1 px-2 py-1 max-w-sm max-h-12 bg-transparent ${
        isDarkBackground
          ? "border-focusedPrimaryColor hover:bg-focusedPrimaryColor text-white"
          : "border-2 border-focusColor hover:bg-focusColor text-primaryColor"
      } rounded-3xl flex items-center ${
        animate === AnimateDirection.leftToRight ? "animate-fadeInLeft" : "animate-fadeInRight"
      }`}
    >
      {children}
      {!hideText ? (
        <p
          className={`hidden ml-2 text-sm ${
            isDarkBackground ? "text-white" : "text-textColorPrimary"
          } md:block`}
        >
          {text}
        </p>
      ) : null}
    </button>
  );
};

export { AnimateDirection, SecondaryIconButton };
