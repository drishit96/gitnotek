import { useEffect, useRef } from "react";

const Snackbar = ({ message }: { message: string }) => {
  const snackBarContainerRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snackBarContainer = snackBarContainerRef.current;
    const snackBar = snackbarRef.current;
    if (message) {
      snackBarContainer?.classList.remove("hidden");
      snackBarContainer?.classList.add("flex");
      snackBar?.classList.remove("invisible");
      snackBar?.classList.add("animate-fadeInOut");
      setTimeout(() => {
        snackBar?.classList.add("invisible");
        snackBar?.classList.remove("animate-fadeInOut");
        snackBarContainer?.classList.add("hidden");
        snackBarContainer?.classList.remove("flex");
      }, 2700);
    }
  }, [message]);
  return (
    <>
      <div
        ref={snackBarContainerRef}
        className="hidden justify-center w-full fixed z-30 bottom-8"
      >
        <div className="flex flex-col items-center">
          <div
            ref={snackbarRef}
            className="invisible p-3 mb-3 max-w-max rounded bg-gray-700 text-center text-white"
          >
            {message}
          </div>
        </div>
      </div>
    </>
  );
};
export default Snackbar;
