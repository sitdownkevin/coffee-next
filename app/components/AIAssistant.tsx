import { useState, useRef, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// 添加Props接口
interface AIAssistantProps {
  onAddToCart?: (orderItems: any[]) => void;
  onOpenCart?: () => void;
  onShowToast?: (message: string) => void;
}

export default function AIAssistant({ onAddToCart, onOpenCart, onShowToast }: AIAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 检测浏览器类型
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Brave')) {
      return 'brave';
    } else if (userAgent.includes('Chrome')) {
      return 'chrome';
    } else if (userAgent.includes('Safari')) {
      return 'safari';
    } else if (userAgent.includes('Firefox')) {
      return 'firefox';
    }
    return 'unknown';
  };

  useEffect(() => {
    const browser = detectBrowser();
    setBrowserInfo(browser);

    // 检查浏览器是否支持语音识别
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setError('您的浏览器不支持语音识别功能');
      return;
    }

    // Brave浏览器特殊提示
    if (browser === 'brave') {
      setError('检测到Brave浏览器。如遇网络问题，请尝试:\n1. 关闭广告拦截器\n2. 检查隐私设置\n3. 允许Google服务连接');
    }

    // 初始化语音识别
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        // 如果有最终结果，发送到后端处理
        if (finalTranscript) {
          handleSpeechToBackend(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('语音识别错误详情:', event);
        
        let errorMessage = '';
        switch (event.error) {
          case 'network':
            if (browser === 'brave') {
              errorMessage = `网络连接错误 (Brave浏览器)\n可能解决方案:\n• 在Brave设置中关闭"阻止脚本"\n• 允许语音识别相关的Google服务\n• 尝试刷新页面后重试`;
            } else {
              errorMessage = '网络连接错误，请检查网络连接';
            }
            break;
          case 'not-allowed':
            errorMessage = '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问';
            break;
          case 'no-speech':
            errorMessage = '未检测到语音，请重试';
            break;
          case 'audio-capture':
            errorMessage = '音频捕获失败，请检查麦克风设备';
            break;
          case 'service-not-allowed':
            errorMessage = '语音识别服务不可用';
            break;
          default:
            errorMessage = `语音识别错误: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      setError('');
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('启动语音识别失败:', error);
        setError('启动语音识别失败，请重试');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSpeechToBackend = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // 这里发送到后端API
      const response = await fetch('/api/speech-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: text,
          timestamp: new Date().toISOString(),
          browser: browserInfo
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('后端返回数据：', data);
      setResponse(data.response || '处理完成');
      
      // 处理点单逻辑 - 直接加入购物车，不显示确认界面
      if (data.isOrder && data.orderInfo) {
        console.log('检测到点单，订单信息：', data.orderInfo);
        
        // 如果有购物车回调函数，直接添加到购物车
        if (onAddToCart && data.orderInfo.items) {
          // 转换格式以匹配现有的购物车结构
          const cartItems = data.orderInfo.items.map((item: any) => ({
            coffee: {
              name: item.name,
              description: item.description,
              basePrice: item.price
            },
            selectedCup: { name: item.size, addPrice: 0 },
            selectedSugar: { name: "正常糖", addPrice: 0 },
            selectedTemperature: { name: item.temperature, addPrice: 0 },
            quantity: item.quantity,
            totalPrice: item.totalPrice
          }));
          
          console.log('转换后的购物车商品：', cartItems);
          onAddToCart(cartItems);
          
          // 显示Toast提示
          if (onShowToast) {
            onShowToast(`已添加${data.orderInfo.totalQuantity}件商品到购物车`);
          }
          
          // 延迟打开购物车，让用户看到Toast提示
          setTimeout(() => {
            if (onOpenCart) {
              onOpenCart();
            }
          }, 1500);
          
          // 更新响应消息
          setResponse(`✅ 已为您添加${data.orderInfo.totalQuantity}件商品到购物车，总计¥${data.orderInfo.totalAmount}`);
        }
      }
      
    } catch (error) {
      console.error('处理语音时出错:', error);
      setError('语音处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 权限检查函数
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('麦克风权限检查失败:', error);
      return false;
    }
  };

  const handlePermissionCheck = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (hasPermission) {
      setError('');
      setResponse('麦克风权限正常 ✅');
    } else {
      setError('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 border-l border-gray-200 flex flex-col p-6">
      <div className="flex-1 flex flex-col space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI语音助手</h2>
          <p className="text-gray-600">点击麦克风开始语音识别</p>
          {browserInfo && (
            <p className="text-xs text-gray-500 mt-1">
              浏览器: {browserInfo === 'brave' ? 'Brave' : browserInfo === 'chrome' ? 'Chrome' : browserInfo}
            </p>
          )}
        </div>

        {/* 语音识别区域 */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* 权限检查按钮 (仅在Brave浏览器显示) */}
          {browserInfo === 'brave' && (
            <button
              onClick={handlePermissionCheck}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
            >
              🔍 检查麦克风权限
            </button>
          )}

          {/* 麦克风按钮 */}
          <div className="relative">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
                transition-all duration-300 transform hover:scale-105 shadow-lg
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isListening ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M5.293 6.707a1 1 0 010-1.414 7 7 0 119.414 0 1 1 0 01-1.414 1.414 5 5 0 10-7.071 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {isListening && (
              <div className="absolute -inset-2 border-2 border-red-300 rounded-full animate-ping"></div>
            )}
          </div>

          {/* 状态显示 */}
          <div className="text-center">
            {isListening && (
              <p className="text-blue-600 font-medium">🎤 正在听取语音...</p>
            )}
            {isProcessing && (
              <p className="text-orange-600 font-medium">🔄 正在处理语音...</p>
            )}
          </div>

          {/* 识别结果显示 */}
          {transcript && (
            <div className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">识别结果:</h3>
              <div className="bg-white p-4 rounded-lg shadow-md border">
                <p className="text-gray-800">{transcript}</p>
              </div>
            </div>
          )}

          {/* 后端处理结果显示 */}
          {response && (
            <div className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">处理结果:</h3>
              <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200">
                <p className="text-green-800">{response}</p>
              </div>
            </div>
          )}

          {/* 错误信息显示 */}
          {error && (
            <div className="w-full max-w-md">
              <div className="bg-red-50 p-4 rounded-lg shadow-md border border-red-200">
                <p className="text-red-800 whitespace-pre-line">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">使用说明:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 点击麦克风按钮开始录音</li>
            <li>• 说话完毕后会自动停止并发送到后端处理</li>
            <li>• 支持中文语音识别和咖啡点单</li>
            <li>• 语音点单示例：我要一杯拿铁、来两杯美式</li>
            <li>• <span className="text-green-600 font-medium">检测到点单后将自动添加到购物车并打开</span></li>
            <li>• 需要允许浏览器使用麦克风权限</li>
            {browserInfo === 'brave' && (
              <>
                <li className="text-orange-600 font-medium">Brave浏览器特别提示:</li>
                <li>• 如遇网络问题，请关闭广告拦截器</li>
                <li>• 在隐私设置中允许Google服务连接</li>
                <li>• 点击上方"检查麦克风权限"确认权限状态</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 