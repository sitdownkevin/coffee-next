import { useState, useRef, useEffect } from "react";

import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

import type { ChatBase, ChatStatus, MessageBase } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

const KeyboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

// 语音波形组件
const VoiceWaveform = ({
  volume,
  isRecording,
}: {
  volume: number;
  isRecording: boolean;
}) => {
  const bars = Array.from({ length: 5 }, (_, i) => {
    const height = 9 + volume * 0.1;
    const delay = i * 0.2;
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

  return <div className="flex items-center justify-center h-8">{bars}</div>;
};

const MicrophoneIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    ></path>
  </svg>
);

export default function ChatInput({
  chat, // 当前聊天内容
  setChat, // 用于添加用户消息
  chatStatus, // 用于显示当前聊天状态
  setChatStatus, // 用于设置当前聊天状态
  setItemsInChat, // 用于清空Chat中的待选商品
  interactionMode,
}: {
  chat: ChatBase;
  setChat: (chat: ChatBase) => void;
  chatStatus: ChatStatus;
  setChatStatus: (chatStatus: ChatStatus) => void;
  setItemsInChat: (items: ItemInCart[]) => void;
  interactionMode: "chat" | "text";
}) {
  const [currentInput, setCurrentInput] = useState(interactionMode);
  const [text, setText] = useState("");

  useEffect(() => {
    setCurrentInput(interactionMode);
  }, [interactionMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newHumanMessage: MessageBase = {
      role: "human",
      content: text,
    };
    setChat([...chat, newHumanMessage]);
    setChatStatus(ChatStatusEnum.Pending);
    setText("");
  };

  const isProcessing =
    chatStatus === ChatStatusEnum.AsrProcessing ||
    chatStatus === ChatStatusEnum.NlpProcessing ||
    chatStatus === ChatStatusEnum.Pending;

  if (currentInput === "text") {
    return (
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentInput("chat")}
            className="flex-shrink-0 text-gray-500 hover:text-blue-600 focus:outline-none transition-colors duration-200 p-1 group"
            aria-label="切换到语音输入"
          >
            <MicrophoneIcon />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入您的问题..."
            className="flex-1 w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-transparent rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!text.trim() || isProcessing}
            aria-label="发送消息"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex justify-center items-center">
          <ChatVoiceInput
            chat={chat}
            setChat={setChat}
            chatStatus={chatStatus}
            setChatStatus={setChatStatus}
          />
        </div>

        <button 
          onClick={() => setCurrentInput("text")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 focus:outline-none transition-colors duration-200 group"
          aria-label="切换到文本输入"
        >
          <KeyboardIcon />
          <span>文本输入</span>
        </button>
      </div>
    </div>
  );
}

function ChatVoiceInput({
  chat,
  setChat,
  chatStatus,
  setChatStatus,
}: {
  chat: ChatBase;
  setChat: (chat: ChatBase) => void;
  chatStatus: ChatStatus;
  setChatStatus: (chatStatus: ChatStatus) => void;
}) {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState(0);

  const recorderRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isButtonPressedRef = useRef(false);

  // 初始化录音器
  const initRecorder = async () => {
    try {
      if (recorderRef.current) {
        recorderRef.current.close();
        recorderRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1,
        },
      });

      recorderRef.current = Recorder({
        type: "mp3",
        sampleRate: 16000,
        bitRate: 16,
        onProcess: (buffers: any, powerLevel: number) => {
          setRecordingVolume(Math.min(100, Math.max(0, powerLevel * 100)));
        },
        sourceStream: stream,
      });

      await new Promise<void>((resolve, reject) => {
        recorderRef.current.open(
          () => {
            console.log("录音器已就绪");
            resolve();
          },
          (msg: string, isUserNotAllow: boolean) => {
            console.error(`录音器初始化失败: ${msg}, ${isUserNotAllow}`);
            reject(new Error(isUserNotAllow ? "请授权麦克风权限" : msg));
          }
        );
      });
    } catch (error) {
      console.error("录音初始化失败:", error);
      throw error;
    }
  };

  // 开始录音
  const handleStartRecording = async () => {
    setChatStatus(ChatStatusEnum.Inputting);
    // setItemsInChat([]);

    try {
      await initRecorder();

      if (!isButtonPressedRef.current) {
        console.log("录音被提前取消");
        if (recorderRef.current) {
          recorderRef.current.close();
          recorderRef.current = null;
        }
        setChatStatus(ChatStatusEnum.Completed);
        return;
      }

      setRecordingDuration(0);
      setRecordingVolume(0);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      recorderRef.current?.start();
    } catch (error) {
      console.error("录音启动失败:", error);
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  // 停止录音
  const handleStopRecording = () => {
    if (!recorderRef.current || chatStatus !== ChatStatusEnum.Inputting) return;

    setRecordingVolume(0);

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (recordingDuration < 1) {
      setChatStatus(ChatStatusEnum.Completed);
      recorderRef.current.stop();
      recorderRef.current.close();
      recorderRef.current = null;
      return;
    }

    try {
      recorderRef.current.stop(
        async (blob: Blob, duration: number) => {
          console.log("录音结束，时长：", duration, "毫秒");

          recorderRef.current?.close();
          recorderRef.current = null;

          await uploadAudioForASR(blob, "mp3");
        },
        (msg: string) => {
          console.error("录音停止失败:", msg);
          recorderRef.current?.close();
          recorderRef.current = null;
          setChatStatus(ChatStatusEnum.Completed);
        }
      );
    } catch (error) {
      console.error("停止录音时发生错误:", error);
      recorderRef.current?.close();
      recorderRef.current = null;
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  // 上传音频进行ASR识别
  const uploadAudioForASR = async (audioBlob: Blob, extension?: string) => {
    setChatStatus(ChatStatusEnum.AsrProcessing);

    try {
      const formData = new FormData();

      let fileName = "recording.wav";
      if (extension) {
        fileName = `recording.${extension}`;
      } else if (audioBlob instanceof File) {
        fileName = audioBlob.name;
      }

      formData.append("audio", audioBlob, fileName);

      console.log(
        "上传音频文件进行ASR识别:",
        fileName,
        "大小:",
        audioBlob.size
      );

      const response = await fetch("/api/tencent-asr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log("ASR识别成功:", data.text);
        await processRecognizedText(data.text);
      } else {
        console.error("ASR识别失败:", data.error, data.details);
        setChatStatus(ChatStatusEnum.Completed);
      }
    } catch (error) {
      console.error("ASR上传或请求失败:", error);
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  // 处理识别的文本
  const processRecognizedText = async (text: string) => {
    const newHumanMessage: MessageBase = {
      role: "human",
      content: text,
    };
    setChat([...chat, newHumanMessage]);
    setChatStatus(ChatStatusEnum.Pending);
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.close();
        recorderRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, []);

  const [buttonPressed, setButtonPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonDown = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      isButtonPressedRef.current ||
      chatStatus === ChatStatusEnum.AsrProcessing ||
      chatStatus === ChatStatusEnum.NlpProcessing
    )
      return;

    isButtonPressedRef.current = true;
    setButtonPressed(true);

    await handleStartRecording();

    buttonRef.current?.focus();
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isButtonPressedRef.current) return;

    isButtonPressedRef.current = false;
    setButtonPressed(false);

    handleStopRecording();
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isButtonPressedRef.current) {
      isButtonPressedRef.current = false;
      setButtonPressed(false);

      handleStopRecording();
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
    if (isButtonPressedRef.current) {
      isButtonPressedRef.current = false;
      setButtonPressed(false);

      handleStopRecording();
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

    button.addEventListener("blur", preventBlur);
    return () => button.removeEventListener("blur", preventBlur);
  }, [buttonPressed]);

  // 处理页面失去焦点的情况
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && buttonPressed) {
        isButtonPressedRef.current = false;
        setButtonPressed(false);
        if (handleStopRecording) {
          handleStopRecording();
        }
      }
    };

    const handleWindowBlur = () => {
      if (buttonPressed) {
        isButtonPressedRef.current = false;
        setButtonPressed(false);
        if (handleStopRecording) {
          handleStopRecording();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [buttonPressed, handleStopRecording]);

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleButtonDown}
      onMouseUp={handleButtonUp}
      onMouseLeave={handleButtonLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onContextMenu={(e) => e.preventDefault()}
      disabled={
        chatStatus === ChatStatusEnum.AsrProcessing ||
        chatStatus === ChatStatusEnum.NlpProcessing ||
        chatStatus === ChatStatusEnum.Pending
      }
      className={`
      w-3/4 max-w-md h-16 rounded-full
      flex items-center justify-center cursor-pointer
      shadow-2xl transform transition-all duration-300 ease-in-out
      select-none touch-none
      text-white font-semibold text-xl
      focus:outline-none focus:ring-4 focus:ring-opacity-75
      ${
        buttonPressed || chatStatus === ChatStatusEnum.Inputting
          ? "bg-rose-600 scale-105 shadow-inner"
          : chatStatus === ChatStatusEnum.AsrProcessing ||
            chatStatus === ChatStatusEnum.NlpProcessing
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 active:scale-95 focus:ring-blue-500"
      }
    `}
    >
      <div className="flex items-center space-x-3 pointer-events-none">
        {chatStatus === ChatStatusEnum.AsrProcessing ||
        chatStatus === ChatStatusEnum.NlpProcessing ? (
          <>
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-lg">识别中...</span>
          </>
        ) : (
          <>
            {buttonPressed || chatStatus === ChatStatusEnum.Inputting ? (
              <>
                <VoiceWaveform
                  volume={recordingVolume}
                  isRecording={chatStatus === ChatStatusEnum.Inputting}
                />
                <span>松开发送</span>
              </>
            ) : (
              <>
                <MicrophoneIcon />
                <span>按住说话</span>
              </>
            )}
          </>
        )}
      </div>
    </button>
  );
}