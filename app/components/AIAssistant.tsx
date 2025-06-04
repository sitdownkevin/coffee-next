import { useState, useRef, useEffect } from 'react';

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

interface AIAssistantProps {
  onAddToCart?: (orderItems: any[]) => void;
  onOpenCart?: () => void;
  onShowToast?: (message: string) => void;
}

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isProcessing = isProcessingASR || isProcessingNLP;

  const getSupportedMimeType = (): { mimeType: string; extension: string } => {
    // const supportedFormats = [
    //   { mimeType: 'audio/wav', extension: 'wav' },
    //   { mimeType: 'audio/mp3', extension: 'mp3' },
    //   { mimeType: 'audio/mpeg', extension: 'mp3' },
    //   { mimeType: 'audio/mp4', extension: 'm4a' },
    //   { mimeType: 'audio/aac', extension: 'aac' },
    //   { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
    //   { mimeType: 'audio/webm;codecs=opus', extension: 'ogg' },
    // ];

    // for (const format of supportedFormats) {
    //   if (MediaRecorder.isTypeSupported(format.mimeType)) {
    //     console.log('浏览器和ASR均支持的格式:', format.mimeType);
    //     return format;
    //   }
    // }

    // console.warn('未找到浏览器和ASR都支持的格式，使用默认wav');
    return { mimeType: 'audio/wav', extension: 'wav' };
  };

  const handleStartRecording = async () => {
    if (isRecording || isProcessing) return;

    clearResult();
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1,
        } 
      });
      
      const { mimeType } = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const { mimeType, extension } = getSupportedMimeType();
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mimeType
        });
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        await uploadAudioForASR(audioBlob, extension);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      
    } catch (error) {
      console.error('录音启动失败:', error);
      setIsRecording(false);
      setResult({
        success: false,
        error: '录音启动失败',
        details: '请确保已授权麦克风权限或浏览器支持录音功能'
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
      const response = await fetch('/api/speech-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, timestamp: new Date().toISOString(), browser: navigator.userAgent }),
      });
      
      const data: RecognitionResult = await response.json();
      setResult(data);

      console.log('Speech-processing API 返回:', data);

      if (data.success && data.isOrder && data.actions?.openCart) {
        console.log('检测到点单意图，模拟打开购物车...');
        // TODO: 打开购物车
        if (onAddToCart && data.orderInfo.items) {
            const cartItems = data.orderInfo.items.map((item: any) => ({
                coffee: {
                    name: item.name,
                    description: item.description,
                    basePrice: item.price,
                },
                selectedCup: { name: item.size, addPrice: 0 },
                selectedSugar: { name: item.sugar, addPrice: 0 },
                selectedTemperature: { name: item.temperature, addPrice: 0 },
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            }));

            console.log('转换后的购物车商品:', cartItems);
            onAddToCart(cartItems);

            if (onShowToast) {
                onShowToast(`已添加${data.orderInfo.totalQuantity}件商品`);
            }

            setTimeout(() => {
                if (onOpenCart) {
                    onOpenCart();
                }
            }, 1500);
        }
      }
      
    } catch (error) {
      console.error('Speech-processing API 调用失败:', error);
      setResult({
        success: false,
        error: '文本处理服务失败',
        details: '调用 speech-processing API 时发生错误'
      });
    } finally {
      setIsProcessingNLP(false);
    }
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
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="h-full bg-amber-50/30 md:border-l border-amber-100 overflow-y-auto mobile-scroll">
      <div className="flex flex-col items-center justify-center min-h-full p-6 space-y-6">
        {/* 顶部标题区域 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-800">智能点单助手</h1>
          <p className="text-amber-600/80 text-sm md:text-base">
            {!isRecording && !isProcessing && !result && !recognizedText ? 
              "按住下方按钮开始语音点单" : ""}
          </p>
        </div>

        {/* 录音按钮区域 */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            onTouchStart={handleStartRecording}
            onTouchEnd={handleStopRecording}
            disabled={isProcessing}
            className={`
              w-20 h-20 md:w-24 md:h-24 rounded-full 
              flex items-center justify-center
              shadow-lg transform transition-all duration-300
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse shadow-red-200' 
                : isProcessing 
                ? 'bg-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isProcessingASR || isProcessingNLP ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"/>
            ) : isRecording ? (
              <span className="text-2xl">🎙️</span>
            ) : (
              <span className="text-2xl">🎙️</span>
            )}
          </button>

          <div className="text-center">
            {isRecording && <p className="text-red-600 font-medium animate-pulse">正在聆听...</p>}
            {isProcessingASR && <p className="text-amber-600 font-medium">正在识别语音...</p>}
            {isProcessingNLP && <p className="text-amber-600 font-medium">正在理解内容...</p>}
          </div>
        </div>

        {/* 识别结果区域 */}
        {recognizedText && !isProcessingNLP && (
          <div className="w-full max-w-md space-y-2 p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
            <h3 className="text-lg font-semibold text-amber-800">识别到的内容：</h3>
            <p className="text-gray-700 text-base leading-relaxed">{recognizedText}</p>
          </div>
        )}

        {/* 处理结果区域 */}
        {result && (
          <div className="w-full max-w-md p-4">
            {result.success ? (
              <div className="bg-white border border-amber-200 rounded-xl p-5 space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-800">处理结果：</h3>
                <p className="text-gray-700 text-base leading-relaxed">{result.response}</p>
                
                {result.isOrder && result.orderInfo && (
                  <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-amber-800">订单详情:</h4>
                    <ul className="space-y-2">
                      {result.orderInfo.items.map((item: any, index: number) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="text-amber-600 mr-2">•</span>
                          {item.quantity} 杯 {item.name}
                          <span className="text-gray-500 text-sm ml-2">
                            ({item.size}, {item.temperature})
                          </span>
                          <span className="ml-auto font-medium">¥{item.totalPrice}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-amber-200">
                      <p className="font-semibold text-amber-800 flex justify-between">
                        <span>总计 ({result.orderInfo.totalQuantity} 件商品)</span>
                        <span>¥{result.orderInfo.totalAmount}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                {result.audioInfo && (
                  <div className="text-xs text-amber-600/70 space-y-1 pt-2">
                    <p>格式：{result.audioInfo.format}</p>
                    <p>大小：{Math.round(result.audioInfo.size / 1024)} KB</p>
                    {result.audioInfo.duration > 0 && (
                      <p>时长：约 {Math.round(result.audioInfo.duration)} 秒</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-red-200 rounded-xl p-5 space-y-3 shadow-sm">
                <h3 className="text-lg font-semibold text-red-800">处理失败</h3>
                <p className="text-red-600">{result.error}</p>
                {result.details && (
                  <p className="text-sm text-red-500/80">{result.details}</p>
                )}
                {result.message && (
                  <p className="text-xs text-gray-500 mt-2">详细信息：{result.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}