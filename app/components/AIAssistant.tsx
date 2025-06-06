import { useState, useRef, useEffect } from 'react';
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'

interface RecognitionResult {
  success: boolean;
  text?: string;
  error?: string;
  details?: string;
  message?: string;
  audioInfo?: {
    format: string;
    size: number;
    duration: number;
  };
  isOrder?: boolean;
  response?: string;
  orderInfo?: any;
  actions?: { openCart?: boolean; showConfirmDialog?: boolean };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
  orderPreview?: {
    name: string;
    price: number;
    size: string;
    temperature: string;
    sugar: string;
    quantity: number;
  };
}

interface AIAssistantProps {
  onAddToCart?: (orderItems: any[]) => void;
  onOpenCart?: () => void;
  onShowToast?: (message: string) => void;
}

const VoiceWaveform = ({ volume, isRecording }: { volume: number; isRecording: boolean }) => {
  // 生成5个波形条
  const bars = Array.from({ length: 5 }, (_, i) => {
    const height = 12 + (volume * 0.2); // 基础高度12px，最大可增加20px
    const delay = i * 0.1; // 每个条之间的延迟
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

const OrderPreview = ({ order, onAddToCart }: { 
  order: Message['orderPreview'], 
  onAddToCart: () => void 
}) => {
  if (!order) return null;
  
  return (
    <div className="bg-white rounded-lg p-4 space-y-3">
      
      {/* 商品信息 */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21v-2h18v2H2zM3 9v8h16V9h2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V9h2zm16-4V3h-2v2H5V3H3v2H1v2h20V5h-2zM6 7h12v2H6V7z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium">{order.name}</div>
          <div className="text-gray-500 text-sm">
            {order.size} / {order.temperature} / {order.sugar}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-red-500">¥{order.price}</div>
            <div className="text-gray-500">x{order.quantity}</div>
          </div>
        </div>
      </div>
      
      {/* 下单按钮 */}
      <button
        onClick={onAddToCart}
        className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
      >
        去下单
      </button>
    </div>
  );
};

export default function AIAssistant({
    onAddToCart,
    onOpenCart,
    onShowToast,
}: AIAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingASR, setIsProcessingASR] = useState(false);
  const [isProcessingNLP, setIsProcessingNLP] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好，我是你的智能点单助手，正在为您推荐今日特色...' },
  ]);

  const recorderRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isProcessing = isProcessingASR || isProcessingNLP;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 获取推荐咖啡
  const fetchRecommendation = async () => {
    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: new Date().toISOString() }),
      });

      const data = await response.json();
      
      if (data.success && data.recommendation) {
        const recommendationMessage: Message = {
          role: 'assistant',
          content: data.response,
          orderPreview: data.recommendation
        };

        setMessages(prev => {
          // 替换初始的加载消息
          const newMessages = [...prev];
          newMessages[0] = recommendationMessage;
          return newMessages;
        });
      } else {
        // 如果获取推荐失败，显示默认欢迎消息
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[0] = { role: 'assistant', content: '你好，我是你的智能点单助手，有什么可以帮你的吗？' };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('获取推荐咖啡失败:', error);
      // 如果获取推荐失败，显示默认欢迎消息
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[0] = { role: 'assistant', content: '你好，我是你的智能点单助手，有什么可以帮你的吗？' };
        return newMessages;
      });
    }
  };

  // 在组件挂载时获取推荐
  useEffect(() => {
    fetchRecommendation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initRecorder = async () => {
    try {
      // 确保先关闭之前的录音实例
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

      // 创建新的录音实例
      recorderRef.current = Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16,
        onProcess: (buffers: any, powerLevel: number) => {
          setRecordingVolume(Math.min(100, Math.max(0, powerLevel * 100)));
        },
        // 添加音频输入配置
        sourceStream: stream,
      });

      // 打开录音权限
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
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '录音初始化失败，请确保已授权麦克风权限或浏览器支持录音功能',
        error: true
      }]);
      throw error;
    }
  };

  const handleStartRecording = async () => {
    if (isRecording || isProcessing) return;

    try {
      await initRecorder();
      
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingVolume(0);
      
      // 开始计时
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // 开始录音
      recorderRef.current?.start();
      
    } catch (error) {
      console.error('录音启动失败:', error);
      setIsRecording(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '录音启动失败，请重试',
        error: true
      }]);
    }
  };

  const handleStopRecording = () => {
    if (!recorderRef.current || !isRecording) return;
    
    setIsRecording(false);
    setRecordingVolume(0);
    
    // 清除计时器
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    // 如果录音时间太短，提示用户
    if (recordingDuration < 1) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '录音时间太短，请重试',
        error: true
      }]);
      recorderRef.current.stop();
      recorderRef.current.close();
      recorderRef.current = null;
      return;
    }
    
    try {
      recorderRef.current.stop(async (blob: Blob, duration: number) => {
        console.log('录音结束，时长：', duration, '毫秒');
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // 添加一条待处理的消息
        setMessages(prev => [...prev, {
          role: 'user',
          content: '正在处理语音...',
          pending: true
        }]);
        
        // 关闭并清理录音实例
        recorderRef.current?.close();
        recorderRef.current = null;
        
        await uploadAudioForASR(blob, 'mp3');
      }, (msg: string) => {
        console.error('录音停止失败:', msg);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '录音停止失败，请重试',
          error: true
        }]);
        // 确保清理录音实例
        recorderRef.current?.close();
        recorderRef.current = null;
      });
    } catch (error) {
      console.error('停止录音时发生错误:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '录音停止时发生错误，请重试',
        error: true
      }]);
      // 确保清理录音实例
      recorderRef.current?.close();
      recorderRef.current = null;
    }
  };

  const uploadAudioForASR = async (audioBlob: Blob, extension?: string) => {
    setIsProcessingASR(true);
    setRecognizedText(null);
    setResult(null);
    
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
        setRecognizedText(data.text);
        await processRecognizedText(data.text);
      } else {
        console.error('ASR识别失败:', data.error, data.details);
        setResult({
          success: false,
          error: data.error || '语音识别失败',
          details: data.details || '未知错误',
          message: data.message
        });
      }
      
    } catch (error) {
      console.error('ASR上传或请求失败:', error);
      setResult({
        success: false,
        error: '网络请求失败',
        details: '请检查网络连接或服务器状态后重试'
      });
    } finally {
      setIsProcessingASR(false);
    }
  };

  const processRecognizedText = async (text: string) => {
    setIsProcessingNLP(true);
    setResult(null);
    
    try {
      console.log('发送文本到speech-processing API:', text);
      
      // 更新待处理消息为实际识别文本
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.pending) {
          lastMessage.content = text;
          lastMessage.pending = false;
        }
        return newMessages;
      });
      
      const response = await fetch('/api/speech-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, timestamp: new Date().toISOString(), browser: navigator.userAgent }),
      });
      
      const data = await response.json();
      setResult(data);

      // 添加助手回复
      if (data.success) {
        const newMessage: Message = {
          role: 'assistant',
          content: data.response
        };

        // 如果是订单，添加订单预览信息
        if (data.isOrder && data.orderInfo && data.orderInfo.items?.[0]) {
          const item = data.orderInfo.items[0];
          newMessage.orderPreview = {
            name: item.name,
            price: item.price,
            size: item.size,
            temperature: item.temperature,
            sugar: item.sugar,
            quantity: item.quantity,
          };
        }

        setMessages(prev => [...prev, newMessage]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.error || '处理失败，请重试',
          error: true
        }]);
      }
      
    } catch (error) {
      console.error('Speech-processing API 调用失败:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '处理失败，请重试',
        error: true
      }]);
    } finally {
      setIsProcessingNLP(false);
    }
  };

  const handleOrderActions = (orderPreview: Message['orderPreview']) => {
    if (!orderPreview || !onAddToCart) return;

    const cartItems = [{
      coffee: {
        name: orderPreview.name,
        description: '',
        basePrice: orderPreview.price,
      },
      selectedCup: { name: orderPreview.size, addPrice: 0 },
      selectedSugar: { name: orderPreview.sugar, addPrice: 0 },
      selectedTemperature: { name: orderPreview.temperature, addPrice: 0 },
      quantity: orderPreview.quantity,
      totalPrice: orderPreview.price * orderPreview.quantity,
    }];

    onAddToCart(cartItems);
    if (onShowToast) {
      onShowToast(`已添加${orderPreview.quantity}件商品`);
    }
    setTimeout(() => {
      if (onOpenCart) {
        onOpenCart();
      }
    }, 1500);
  };

  const clearResult = () => {
    setRecognizedText(null);
    setResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      // 组件卸载时清理资源
      if (recorderRef.current) {
        recorderRef.current.close();
        recorderRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation(); // 阻止事件冒泡
    
    if (isProcessing || buttonPressed) return;
    
    setButtonPressed(true);
    handleStartRecording();
    
    // 确保按钮保持焦点
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

  // 处理触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // 阻止默认滚动行为
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
        handleStopRecording();
      }
    };

    const handleWindowBlur = () => {
      if (buttonPressed) {
        setButtonPressed(false);
        handleStopRecording();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [buttonPressed]);

  return (
    <div className="flex flex-col h-full bg-amber-50/30 md:border-l border-amber-100">
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

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div className="max-w-[80%]">
              <div
                className={`p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-white text-gray-800'
                    : message.error
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-500 text-white'
                } ${message.pending ? 'animate-pulse' : ''}`}
              >
                {message.content}
              </div>
              {message.orderPreview && (
                <div className="mt-2">
                  <OrderPreview 
                    order={message.orderPreview} 
                    onAddToCart={() => handleOrderActions(message.orderPreview)} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 录音状态显示 */}
      {isRecording && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/75 text-white px-6 py-4 rounded-lg space-y-2">
            <div className="text-center">正在录音...</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="text-sm">{recordingDuration}s</div>
              <VoiceWaveform volume={recordingVolume} isRecording={isRecording} />
            </div>
          </div>
        </div>
      )}

      {/* 底部录音按钮区域 */}
      <div className="p-4 border-t border-amber-100 bg-white">
        <div className="flex justify-center">
          <button
            ref={buttonRef}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
            disabled={isProcessing}
            className={`
              w-full max-w-md h-12 rounded-full
              flex items-center justify-center
              shadow-lg transform transition-all duration-300
              select-none touch-none
              ${buttonPressed 
                ? 'bg-red-500 scale-105' 
                : isProcessing 
                ? 'bg-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 active:scale-95'
              }
              text-white font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
            `}
          >
            <div className="flex items-center space-x-2 pointer-events-none">
              {isProcessingASR || isProcessingNLP ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full"/>
              ) : (
                <>
                  {buttonPressed ? (
                    <>
                      <VoiceWaveform volume={recordingVolume} isRecording={isRecording} />
                      <span>松开结束</span>
                    </>
                  ) : (
                    <>
                      <span>按住说话</span>
                    </>
                  )}
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}