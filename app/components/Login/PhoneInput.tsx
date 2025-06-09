import { useState } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    // 移除所有非数字字符
    const numbers = phone.replace(/\D/g, '');
    
    // 限制最大长度为11位
    const limited = numbers.slice(0, 11);
    
    // 格式化显示
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 7)} ${limited.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="relative">
      <div className={`relative flex items-center border-2 rounded-2xl transition-all duration-200 ${
        isFocused 
          ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
          : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50' : ''}`}>
        
        {/* 国家代码 */}
        <div className="flex items-center px-4 py-3 border-r border-gray-200">
          <span className="text-2xl mr-2">🇨🇳</span>
          <span className="text-gray-600 font-medium">+86</span>
        </div>
        
        {/* 手机号输入框 */}
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
          placeholder="请输入手机号"
          maxLength={13} // 考虑空格的格式化长度
        />
        
        {/* 清除按钮 */}
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* 验证状态指示 */}
      {value && value.replace(/\s/g, '').length === 11 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* 提示文本 */}
      <p className="text-xs text-gray-500 mt-2">
        演示模式：手机号已预填充，点击登录即可体验
      </p>
    </div>
  );
}
