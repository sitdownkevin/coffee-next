import { useEffect, useRef, useState } from "react";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

import { ChatStatusEnum } from "~/types/chat";
import type { ChatStatus } from "~/types/chat";
import type { ChatBase, MessageBase } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

import ChatCartoon from "~/components/Three/ChatCartoon";
import ChatContainer from "~/components/Assistant/ChatContainer";
import ChatInput from "~/components/Assistant/ChatInput";


export default function Chat({
  handleAddToCart,
}: {
  handleAddToCart: (itemInCart: ItemInCart) => void;
}) {
  const [chatStatus, setChatStatus] = useState<ChatStatus>(
    ChatStatusEnum.Completed
  );

  const [itemsInChat, setItemsInChat] = useState<ItemInCart[]>([]);

  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState(0);

  const recorderRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [chat, setChat] = useState<ChatBase>([
    {
      role: "system",
      content: "你好，我是你的咖啡助手，有什么可以帮助你的？",
    },
  ]);


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
    } finally {
      setChatStatus(ChatStatusEnum.Inputting);
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
      });
    } catch (error) {
      console.error('停止录音时发生错误:', error);
      recorderRef.current?.close();
      recorderRef.current = null;
    } finally {
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
      }
      
    } catch (error) {
      console.error('ASR上传或请求失败:', error);
    } finally {
      setChatStatus(ChatStatusEnum.Completed);
    }
  };

  // 处理识别的文本
  const processRecognizedText = async (text: string) => {
    setChatStatus(ChatStatusEnum.NlpProcessing);
    
    try {
      console.log('发送文本到 /api/chat:', text);
      await fetchChat(chat, text);
      
    } catch (error) {
      console.error('/api/chat 调用失败:', error);
    } finally {
      setChatStatus(ChatStatusEnum.Completed);
    }
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


  const fetchRecommendation = async (chat: ChatBase) => {
    const response = await fetch("/api/recommendation", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    setChat(data.chat);
    setItemsInChat(data.itemsInChat);
  };

  const fetchChat = async (chat: ChatBase, text: string | undefined = undefined) => {
    if (text) {
      chat.push({
        role: "human",
        content: text,
      });
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    setChat(data.chat);
    setItemsInChat(data.itemsInChat);
  };

  useEffect(() => {
    fetchRecommendation(chat);
  }, []);


  return (
    <>
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>

      {/* 录音状态显示 */}
      {chatStatus === ChatStatusEnum.Inputting && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-black/75 text-white px-6 py-4 rounded-lg space-y-2">
            <div className="text-center">正在录音...</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="text-sm">{recordingDuration}s</div>
            </div>
          </div>
        </div>
      )}

      {/* 电脑端 */}
      <div className="hidden md:flex flex-row h-full bg-white border-l-gray-500">
        <div className="w-1/3 h-full">
          <ChatCartoon chatStatus={chatStatus} />
        </div>
        <div className="w-2/3 h-full flex flex-col">
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
          />
          <ChatInput 
            chatStatus={chatStatus} 
            setChatStatus={setChatStatus}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            recordingVolume={recordingVolume}
          />
        </div>
      </div>
      {/* 移动端 */}
      <div className="flex md:hidden flex-row h-full bg-white border-l-gray-500">
        <div className="w-full h-full flex flex-col">
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
          />
          <ChatInput 
            chatStatus={chatStatus} 
            setChatStatus={setChatStatus}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            recordingVolume={recordingVolume}
          />
        </div>
      </div>
    </>
  );
}
