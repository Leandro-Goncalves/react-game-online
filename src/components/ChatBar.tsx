import { useRef } from "react";

interface ChatBarProps {
  sendMessage: (message: string) => void;
}

export const ChatBar: React.FC<ChatBarProps> = ({ sendMessage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: "auto",
        backgroundColor: "rgba(0,0,0, 0.5)",
        height: 80,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          border: 0,
          borderRadius: 15,
          color: "black",
          paddingLeft: "1rem",
        }}
        onKeyDown={(e: any) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            if (inputRef.current?.value) {
              sendMessage(inputRef.current.value);
              inputRef.current.value = "";
            }
          }
        }}
      />
    </div>
  );
};
