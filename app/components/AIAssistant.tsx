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
    const supportedFormats = [
      { mimeType: 'audio/wav', extension: 'wav' },
      { mimeType: 'audio/mp3', extension: 'mp3' },
      { mimeType: 'audio/mpeg', extension: 'mp3' },
      { mimeType: 'audio/mp4', extension: 'm4a' },
      { mimeType: 'audio/aac', extension: 'aac' },
      { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
      { mimeType: 'audio/webm;codecs=opus', extension: 'ogg' },
    ];

    for (const format of supportedFormats) {
      if (MediaRecorder.isTypeSupported(format.mimeType)) {
        console.log('浏览器和ASR均支持的格式:', format.mimeType);
        return format;
      }
    }

    console.warn('未找到浏览器和ASR都支持的格式，使用默认wav');
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
    <div className="h-full bg-white md:border-l border-gray-200 overflow-y-auto mobile-scroll flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">点单助手</h1>
      
      <div className="flex flex-col items-center space-y-4">
        <button
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          disabled={isProcessing}
          className={
            `w-24 h-24 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-4 
            ${isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300 animate-pulse' : 
             isProcessing ? 'bg-gray-500 cursor-not-allowed' : 
             'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'}
            transition-all duration-200 ease-in-out`
          }
        >
          {isProcessingASR ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isProcessingNLP ? (
             <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isRecording ? (
            <span>🔴</span>
          ) : (
            <span>🎤</span>
          )}
        </button>

        {isRecording && <p className="text-red-600">正在录音...</p>}
        {isProcessingASR && <p className="text-blue-600">正在识别语音...</p>}
        {isProcessingNLP && <p className="text-blue-600">正在处理文本...</p>}
        {!isRecording && !isProcessing && !result && !recognizedText && <p className="text-gray-500">按住按钮开始说话</p>}

      </div>
      
      {/* {(recognizedText || result || audioUrl) && !isProcessing && (
         <div className="text-center">
           <button
             onClick={clearResult}
             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
           >
             清除结果
           </button>
         </div>
       )} */}

      {/* {audioUrl && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">录音预览：</h3>
          <audio controls src={audioUrl} className="w-full rounded-md"></audio>
        </div>
      )} */}

      {recognizedText && !isProcessingNLP && (
         <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
           <h3 className="text-lg font-semibold text-blue-800">识别到的文字：</h3>
           <p className="text-gray-800 text-base">{recognizedText}</p>
         </div>
       )}

      {result && (
        <div className="mt-6 p-4">
          {result.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-green-800">处理结果：</h3>
              <p className="text-gray-800 text-base leading-relaxed">{result.response}</p>
              
              {result.isOrder && result.orderInfo && (
                 <div className="bg-green-100 rounded-md p-3 text-sm text-green-900">
                   <h4 className="font-semibold">订单详情:</h4>
                   <ul className="list-disc list-inside">
                     {result.orderInfo.items.map((item: any, index: number) => (
                       <li key={index}>{item.quantity} 杯 {item.name} ({item.size}, {item.temperature}) - {item.totalPrice} 元</li>
                     ))}
                   </ul>
                   <p className="mt-1 font-semibold">总计: {result.orderInfo.totalAmount} 元 ({result.orderInfo.totalQuantity} 件商品)</p>
                 </div>
              )}
              
              {result.audioInfo && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>音频格式：{result.audioInfo.format}</p>
                  <p>文件大小：{Math.round(result.audioInfo.size / 1024)} KB</p>
                  {result.audioInfo.duration > 0 && (
                    <p>音频时长：约 {Math.round(result.audioInfo.duration)} 秒</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <h3 className="text-lg font-semibold text-red-800">处理失败</h3>
              <p className="text-red-700">{result.error}</p>
              {result.details && (
                <p className="text-sm text-red-600">{result.details}</p>
              )}
              {result.message && (
                <p className="text-xs text-gray-500 mt-2">详细信息：{result.message}</p>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}