import { useState } from "react";
import {
  ChatStatusEnum,
  type ChatStatus,
  type MessageBase,
} from "~/types/chat";


export function ChatMessage({ message }: { message: MessageBase }) {
  const [audio, setAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTts = async () => {
    try {
      const response = await fetch("/api/tencent-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message.content,
          sessionId: Date.now().toString(), // 使用时间戳作为sessionId
        }),
      });

      if (!response.ok) {
        throw new Error("TTS请求失败");
      }

      const result = await response.json();
      setAudio(result.audio);
    } catch (error) {
      console.error("文字转语音出错:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);
    if (audio) {
      // 将base64音频数据转换为可播放的格式
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
        { type: "audio/wav" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);

      // 播放音频
      await audioElement.play();

      // 播放完成后清理URL
      audioElement.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlaying(false);
      });
    }

    return;
  };

  // useEffect(() => {
  //   if (message.role === "system" || message.role === "ai") {
  //     handleTts();
  //   }
  // }, [message.role]);

  if (message.role === "system" || message.role === "ai") {
    return (
      <div className={`flex justify-start`}>
        <div
          className={`max-w-[80%] rounded-xl px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }
 
  // if (message.role === "human") {
  //   return (
  //     null
  //   );
  // }

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
