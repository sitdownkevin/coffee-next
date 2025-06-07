import { useState } from "react";
import {
  ChatStatusEnum,
  type ChatStatus,
  type MessageBase,
} from "~/types/chat";


export function ChatMessage({ message }: { message: MessageBase }) {
  const [audio, setAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;

    const playAudioData = async (audioData: string) => {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0))],
        { type: "audio/wav" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      await audioElement.play();

      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlaying(false);
      };
    };

    setIsPlaying(true);

    if (audio) {
      await playAudioData(audio);
      return;
    }

    try {
      const response = await fetch("/api/tencent-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message.content,
          sessionId: Date.now().toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("TTS请求失败");
      }

      const result = await response.json();
      const fetchedAudio = result.audio;
      setAudio(fetchedAudio);
      await playAudioData(fetchedAudio);

    } catch (error) {
      console.error("文字转语音出错:", error);
      setIsPlaying(false);
    }
  };

  if (message.role === "system" || message.role === "ai") {
    return (
      <div className={`flex justify-start`}>
        <div
          className={`relative max-w-[80%] rounded-xl px-4 py-3 bg-gray-100 text-gray-800 rounded-bl-none`}
        >
          <p className="text-sm pb-2">{message.content}</p>
          <div className="flex justify-end border-t border-gray-200 -mx-4 px-3 pt-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${
                isPlaying 
                  ? 'bg-blue-500 text-white cursor-wait' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400'
              }`}
              aria-label="播放语音"
            >
              {isPlaying ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className={`flex justify-end`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2 bg-blue-500 text-white rounded-br-none`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}


export function ChatStatusMessage({ chatStatus }: { chatStatus: ChatStatus }) {
  if (chatStatus === ChatStatusEnum.AsrProcessing) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
          <p className="text-sm">正在识别语音</p>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (chatStatus === ChatStatusEnum.NlpProcessing) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
          <p className="text-sm">大模型理解中</p>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
