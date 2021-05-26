const Loader = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex">
          <svg
            className="stroke-current text-textColorPrimary animate-ping"
            height="60"
            width="60"
          >
            <circle strokeWidth="4" fill="none" r="22" cx="30" cy="30" />
          </svg>
        </div>
      </div>
    </>
  );
};
export default Loader;
