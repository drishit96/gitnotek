import { useEffect, useRef, useState } from "react";

const NetworkStatusIndicator = () => {
  const networkStatusIndicatorRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const networkStatusIndicator = networkStatusIndicatorRef.current;

    setIsOnline(navigator.onLine);
    networkStatusIndicator?.classList.add("hidden");

    window.addEventListener("online", () => {
      setIsOnline(true);
      setTimeout(() => networkStatusIndicator?.classList.add("hidden"), 2500);
    });
    window.addEventListener("offline", () => {
      setIsOnline(false);
      networkStatusIndicator?.classList.remove("hidden");
    });

    return function () {
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  }, []);

  return (
    <div
      ref={networkStatusIndicatorRef}
      className={`p-1 text-center ${
        isOnline ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      You are {isOnline ? "back online!" : "offline!"}
    </div>
  );
};

export default NetworkStatusIndicator;
