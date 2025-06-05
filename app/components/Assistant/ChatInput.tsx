import { useState, useRef } from "react";

import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";


export default function ChatInput({
  chatStatus,
  setChatStatus,
}: {
  chatStatus: ChatStatus;
  setChatStatus: (chatStatus: ChatStatus) => void;
}) {
  const [buttonPressed, setButtonPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) return;

    setButtonPressed(true);
    setChatStatus(ChatStatusEnum.Inputting);

    buttonRef.current?.focus();
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!buttonPressed) return;

    setButtonPressed(false);
    setChatStatus(ChatStatusEnum.Completed);
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) {
      setButtonPressed(false);
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleButtonDown(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleButtonUp(e);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    if (buttonPressed) {
      setButtonPressed(false);
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          onMouseDown={handleButtonDown}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onContextMenu={(e) => e.preventDefault()}
          className={`
                          w-full max-w-md h-12 rounded-full
                          flex items-center justify-center
                          shadow-lg transform transition-all duration-300
                          select-none touch-none
                          ${
                            buttonPressed
                              ? "bg-red-500 scale-105"
                              : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                          }
                          text-white font-medium
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                      `}
        >
          <div className="flex items-center space-x-2 pointer-events-none">
            {buttonPressed ? <span>松开发送</span> : <span>按住说话</span>}
          </div>
        </button>
      </div>
    </div>
  );
}
