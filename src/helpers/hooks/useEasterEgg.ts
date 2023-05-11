import { useRef } from "react";

interface useEasterEggReturn {
  eventListener: () => void;
  removeEventListener: () => void;
}

type handleEasterEgg = () => void;

export const useEasterEgg = (
  secret: string,
  handleEasterEgg: handleEasterEgg
): useEasterEggReturn => {
  const typedCode = useRef("");
  const timeoutId = useRef(0);

  const eventListener = () => {
    window.addEventListener("keydown", (event) => {
      typedCode.current += event.key;

      if (typedCode.current.includes(secret)) {
        typedCode.current = "";
        handleEasterEgg();
      }

      clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        typedCode.current = "";
      }, 2000);
    });
  };
  const removeEventListener = () => {
    window.removeEventListener("keydown", () => {
      typedCode.current = "";
    });
  };

  return {
    eventListener,
    removeEventListener,
  };
};
