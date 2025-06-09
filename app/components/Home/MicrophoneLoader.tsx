import React from 'react';

interface MicrophoneLoaderProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export default function MicrophoneLoader({ isLoading, hasError, onRetry }: MicrophoneLoaderProps) {
  if (!isLoading && !hasError) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        {/* 咖啡杯图标和动画 */}
        <div className="mb-8">
          <div className="relative">
            {/* 咖啡杯主体 */}
            <div className="w-20 h-20 bg-amber-800 rounded-b-full mx-auto relative">
              {/* 咖啡杯手柄 */}
              <div className="absolute -right-3 top-2 w-4 h-8 border-4 border-amber-800 rounded-r-full border-l-0"></div>
              {/* 咖啡液体 */}
              <div className="absolute inset-x-2 top-2 bottom-2 bg-amber-900 rounded-b-full">
                {/* 咖啡泡沫动画 */}
                <div className="absolute inset-x-1 top-1 h-3 bg-amber-100 rounded-full opacity-80">
                  <div className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-1 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
            
            {/* 蒸汽动画 */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-8 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-pulse opacity-60"></div>
            </div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 translate-x-2">
              <div className="w-1 h-6 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-pulse delay-300 opacity-40"></div>
            </div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 -translate-x-2">
              <div className="w-1 h-7 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-pulse delay-500 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* 状态内容 */}
        {isLoading && !hasError && (
          <>
            <h1 className="text-3xl font-bold text-amber-800 mb-4">Coffee Next</h1>
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce mr-2"></div>
              <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce mr-2" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-amber-700 text-lg mb-2">正在获取麦克风权限...</p>
            <p className="text-amber-600 text-sm max-w-md">
              本应用使用语音点单功能，需要您的麦克风权限来提供更好的服务体验
            </p>
          </>
        )}

        {hasError && (
          <>
            <h1 className="text-3xl font-bold text-amber-800 mb-4">Coffee Next</h1>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg mb-2">无法获取麦克风权限</p>
              <p className="text-red-500 text-sm max-w-md mb-6">
                本应用需要麦克风权限来提供语音点单功能。请允许麦克风权限或检查浏览器设置。
              </p>
              <button
                onClick={onRetry}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                重新尝试
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 