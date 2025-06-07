import { useState, useRef, useEffect } from "react";

import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

import type { ChatBase, ChatStatus, MessageBase } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

// 语音波形组件
const VoiceWaveform = ({ volume, isRecording }: { volume: number; isRecording: boolean }) => {
  const bars = Array.from({ length: 5 }, (_, i) => {
    const height = 9 + (volume * 0.1);
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

  return (
    <div className="flex items-center justify-center h-8">
      {bars}
    </div>
  );
};

const MicrophoneIcon = () => (
  <svg
    className="w-6 h-6 text-white"
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
}: {
  chat: ChatBase;
  setChat: (chat: ChatBase) => void;
  chatStatus: ChatStatus;
  setChatStatus: (chatStatus: ChatStatus) => void;
  setItemsInChat: (items: ItemInCart[]) => void;
}) {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState(0);

  const recorderRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        } 
      });

      recorderRef.current = Recorder({
        type: 'mp3',
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
            console.log('录音器已就绪');
            resolve();
          },
          (msg: string, isUserNotAllow: boolean) => {
            console.error(`录音器初始化失败: ${msg}, ${isUserNotAllow}`);
            reject(new Error(isUserNotAllow ? '请授权麦克风权限' : msg));
          }
        );
      });

    } catch (error) {
      console.error('录音初始化失败:', error);
      throw error;
    }
  };

  // 开始录音
  const handleStartRecording = async () => {
    setChatStatus(ChatStatusEnum.Inputting);
    setItemsInChat([]);

    try {
      await initRecorder();
      
      setRecordingDuration(0);
      setRecordingVolume(0);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      recorderRef.current?.start();
      
    } catch (error) {
      console.error('录音启动失败:', error);
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
      recorderRef.current.stop(async (blob: Blob, duration: number) => {
        console.log('录音结束，时长：', duration, '毫秒');
                
        recorderRef.current?.close();
        recorderRef.current = null;
        
        await uploadAudioForASR(blob, 'mp3');
      }, (msg: string) => {
        console.error('录音停止失败:', msg);
        recorderRef.current?.close();
        recorderRef.current = null;
        setChatStatus(ChatStatusEnum.Completed);
      });
    } catch (error) {
      console.error('停止录音时发生错误:', error);
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
      
      let fileName = 'recording.wav';
      if (extension) {
        fileName = `recording.${extension}`;
      } else if (audioBlob instanceof File) {
        fileName = audioBlob.name;
      }
      
      formData.append('audio', audioBlob, fileName);
      
      console.log('上传音频文件进行ASR识别:', fileName, '大小:', audioBlob.size);
      
      const response = await fetch('/api/tencent-asr', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('ASR识别成功:', data.text);
        await processRecognizedText(data.text);
      } else {
        console.error('ASR识别失败:', data.error, data.details);
        setChatStatus(ChatStatusEnum.Completed);
      }
      
    } catch (error) {
      console.error('ASR上传或请求失败:', error);
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

    if (buttonPressed || chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing) return;

    setButtonPressed(true);
    
    await handleStartRecording();

    buttonRef.current?.focus();
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!buttonPressed) return;

    setButtonPressed(false);
    
    handleStopRecording();
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) {
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
    if (buttonPressed) {
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

    button.addEventListener('blur', preventBlur);
    return () => button.removeEventListener('blur', preventBlur);
  }, [buttonPressed]);

  // 处理页面失去焦点的情况
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && buttonPressed) {
        setButtonPressed(false);
        if (handleStopRecording) {
          handleStopRecording();
        }
      }
    };

    const handleWindowBlur = () => {
      if (buttonPressed) {
        setButtonPressed(false);
        if (handleStopRecording) {
          handleStopRecording();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [buttonPressed, handleStopRecording]);

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
          disabled={chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing || chatStatus === ChatStatusEnum.Pending}
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
                : chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 focus:ring-blue-500"
            }
          `}
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            {chatStatus === ChatStatusEnum.AsrProcessing || chatStatus === ChatStatusEnum.NlpProcessing ? (
              <>
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="text-lg">识别中...</span>
              </>
            ) : (
              <>
                {buttonPressed || chatStatus === ChatStatusEnum.Inputting ? (
                  <>
                    <VoiceWaveform volume={recordingVolume} isRecording={chatStatus === ChatStatusEnum.Inputting} />
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
      </div>
    </div>
  );
}