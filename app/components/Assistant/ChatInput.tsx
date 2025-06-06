import { useState, useRef, useEffect } from "react";

import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

// 语音波形组件
const VoiceWaveform = ({ volume, isRecording }: { volume: number; isRecording: boolean }) => {
  const bars = Array.from({ length: 5 }, (_, i) => {
    const height = 12 + (volume * 0.2);
    const delay = i * 0.1;
    return (
      <div
        key={i}
        className="w-1 bg-white rounded-full mx-0.5 animate-wave"
        style={{
          height: `${height}px`,
          animationDelay: `${delay}s`,
          opacity: isRecording ? 1 : 0.5,
        }}
      />
    );
  });

  return (
    <div className="flex items-center justify-center h-8">
      {bars}
    </div>
  );
};


export default function ChatInput({
  chatStatus,
  setChatStatus,
  onStartRecording,
  onStopRecording,
  recordingVolume = 0,
}: {
  chatStatus: ChatStatus;
  setChatStatus: (chatStatus: ChatStatus) => void;
  onStartRecording?: () => Promise<void>;
  onStopRecording?: () => void;
  recordingVolume?: number;
}) {
  const [buttonPressed, setButtonPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonDown = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed || chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing) return;

    setButtonPressed(true);
    
    // 如果有录音功能，调用录音开始
    if (onStartRecording) {
      await onStartRecording();
    } else {
      setChatStatus(ChatStatusEnum.Inputting);
    }

    buttonRef.current?.focus();
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!buttonPressed) return;

    setButtonPressed(false);
    
    // 如果有录音功能，调用录音停止
    if (onStopRecording) {
      onStopRecording();
    } else {
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) {
      setButtonPressed(false);
      
      // 如果有录音功能，调用录音停止
      if (onStopRecording) {
        onStopRecording();
      } else {
        setChatStatus(ChatStatusEnum.Completed);
      }
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
      
      // 如果有录音功能，调用录音停止
      if (onStopRecording) {
        onStopRecording();
      } else {
        setChatStatus(ChatStatusEnum.Completed);
      }
    }
  };

  // 防止按钮失去焦点
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const preventBlur = (e: FocusEvent) => {
      if (buttonPressed) {
        e.preventDefault();
        button.focus();
      }
    };

    button.addEventListener('blur', preventBlur);
    return () => button.removeEventListener('blur', preventBlur);
  }, [buttonPressed]);

  // 处理页面失去焦点的情况
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && buttonPressed) {
        setButtonPressed(false);
        if (onStopRecording) {
          onStopRecording();
        }
      }
    };

    const handleWindowBlur = () => {
      if (buttonPressed) {
        setButtonPressed(false);
        if (onStopRecording) {
          onStopRecording();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [buttonPressed, onStopRecording]);

  return (
    <div className="p-4">
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
          disabled={chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing}
          className={`
            w-full max-w-md h-12 rounded-lg
            flex items-center justify-center cursor-pointer
            shadow-lg transform transition-all duration-300
            select-none touch-none
            ${
              buttonPressed || chatStatus === ChatStatusEnum.Inputting
                ? "bg-red-500 scale-105"
                : chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 active:scale-95"
            }
            text-white font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
        >
          <div className="flex items-center space-x-2 pointer-events-none">
            {chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full"/>
            ) : (
              <>
                {buttonPressed || chatStatus === ChatStatusEnum.Inputting ? (
                  <>
                    {onStartRecording && recordingVolume !== undefined ? (
                      <VoiceWaveform volume={recordingVolume} isRecording={chatStatus === ChatStatusEnum.Inputting} />
                    ) : null}
                    <span>松开发送</span>
                  </>
                ) : (
                  <span>按住说话</span>
                )}
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

// export default function ChatInputBak({
//   chatStatus,
//   setChatStatus,
//   onStartRecording,
//   onStopRecording,
//   recordingVolume = 0,
// }: {
//   chatStatus: ChatStatus;
//   setChatStatus: (chatStatus: ChatStatus) => void;
//   onStartRecording?: () => Promise<void>;
//   onStopRecording?: () => void;
//   recordingVolume?: number;
// }) {
//   const [buttonPressed, setButtonPressed] = useState(false);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   const handleButtonDown = async (e: React.MouseEvent | React.TouchEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (buttonPressed || chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing) return;

//     setButtonPressed(true);
    
//     // 如果有录音功能，调用录音开始
//     if (onStartRecording) {
//       await onStartRecording();
//     } else {
//       setChatStatus(ChatStatusEnum.Inputting);
//     }

//     buttonRef.current?.focus();
//   };

//   const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!buttonPressed) return;

//     setButtonPressed(false);
    
//     // 如果有录音功能，调用录音停止
//     if (onStopRecording) {
//       onStopRecording();
//     } else {
//       setChatStatus(ChatStatusEnum.Completed);
//     }
//   };

//   const handleButtonLeave = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (buttonPressed) {
//       setButtonPressed(false);
      
//       // 如果有录音功能，调用录音停止
//       if (onStopRecording) {
//         onStopRecording();
//       } else {
//         setChatStatus(ChatStatusEnum.Completed);
//       }
//     }
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     e.preventDefault();
//     handleButtonDown(e);
//   };

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     e.preventDefault();
//     handleButtonUp(e);
//   };

//   const handleTouchCancel = (e: React.TouchEvent) => {
//     e.preventDefault();
//     if (buttonPressed) {
//       setButtonPressed(false);
      
//       // 如果有录音功能，调用录音停止
//       if (onStopRecording) {
//         onStopRecording();
//       } else {
//         setChatStatus(ChatStatusEnum.Completed);
//       }
//     }
//   };

//   // 防止按钮失去焦点
//   useEffect(() => {
//     const button = buttonRef.current;
//     if (!button) return;

//     const preventBlur = (e: FocusEvent) => {
//       if (buttonPressed) {
//         e.preventDefault();
//         button.focus();
//       }
//     };

//     button.addEventListener('blur', preventBlur);
//     return () => button.removeEventListener('blur', preventBlur);
//   }, [buttonPressed]);

//   // 处理页面失去焦点的情况
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && buttonPressed) {
//         setButtonPressed(false);
//         if (onStopRecording) {
//           onStopRecording();
//         }
//       }
//     };

//     const handleWindowBlur = () => {
//       if (buttonPressed) {
//         setButtonPressed(false);
//         if (onStopRecording) {
//           onStopRecording();
//         }
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//     };
//   }, [buttonPressed, onStopRecording]);

//   return (
//     <div className="p-4 bg-white">
//       <div className="flex justify-center">
//         <button
//           ref={buttonRef}
//           onMouseDown={handleButtonDown}
//           onMouseUp={handleButtonUp}
//           onMouseLeave={handleButtonLeave}
//           onTouchStart={handleTouchStart}
//           onTouchEnd={handleTouchEnd}
//           onTouchCancel={handleTouchCancel}
//           onContextMenu={(e) => e.preventDefault()}
//           disabled={chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing}
//           className={`
//             w-full max-w-md h-12 rounded-full
//             flex items-center justify-center
//             shadow-lg transform transition-all duration-300
//             select-none touch-none
//             ${
//               buttonPressed || chatStatus === ChatStatusEnum.Inputting
//                 ? "bg-red-500 scale-105"
//                 : chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing
//                 ? "bg-amber-300 cursor-not-allowed"
//                 : "bg-amber-500 hover:bg-amber-600 active:scale-95"
//             }
//             text-white font-medium
//             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
//           `}
//         >
//           <div className="flex items-center space-x-2 pointer-events-none">
//             {chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing ? (
//               <div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full"/>
//             ) : (
//               <>
//                 {buttonPressed || chatStatus === ChatStatusEnum.Inputting ? (
//                   <>
//                     {onStartRecording && recordingVolume !== undefined ? (
//                       <VoiceWaveform volume={recordingVolume} isRecording={chatStatus === ChatStatusEnum.Inputting} />
//                     ) : null}
//                     <span>松开发送</span>
//                   </>
//                 ) : (
//                   <span>按住说话</span>
//                 )}
//               </>
//             )}
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }