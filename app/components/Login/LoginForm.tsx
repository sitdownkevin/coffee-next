import { useState } from "react";
import PhoneInput from "~/components/Login/PhoneInput";

interface LoginFormProps {
  onLogin: (phone: string) => void;
  isLoading: boolean;
}

export default function LoginForm({ onLogin, isLoading }: LoginFormProps) {
  const [phone, setPhone] = useState("138****8888"); // 预填充演示手机号
  const [agreed, setAgreed] = useState(true); // 默认同意条款

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && agreed && !isLoading) {
      onLogin(phone);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 animate-login-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 手机号输入 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号码
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            disabled={isLoading}
          />
        </div>

        {/* 验证码输入（演示用，预填充） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            验证码
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value="123456"
              readOnly
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              placeholder="请输入验证码"
            />
            <button
              type="button"
              disabled
              className="px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl font-medium cursor-not-allowed"
            >
              已发送
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            演示模式：验证码已自动填充
          </p>
        </div>

        {/* 同意条款 */}
        <div className="flex items-start space-x-3">
          <button
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              agreed
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'border-gray-300 hover:border-amber-400'
            }`}
          >
            {agreed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <p className="text-sm text-gray-600 leading-relaxed">
            我已阅读并同意
            <button type="button" className="text-amber-600 hover:text-amber-700 mx-1">
              《用户协议》
            </button>
            和
            <button type="button" className="text-amber-600 hover:text-amber-700 mx-1">
              《隐私政策》
            </button>
          </p>
        </div>

        {/* 登录按钮 */}
        <button
          type="submit"
          disabled={!phone || !agreed || isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
            !phone || !agreed || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-login-glow'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>登录中...</span>
            </div>
          ) : (
            '一键登录'
          )}
        </button>

        {/* 其他登录方式 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">其他登录方式</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled
            className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-400 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
            微信登录
          </button>
          <button
            type="button"
            disabled
            className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-400 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169-.224-.487-.29-.75-.254-.302.043-.57.199-.734.45-.145.219-.169.49-.063.734.105.244.299.434.543.529.244.095.52.075.748-.055.228-.13.395-.347.459-.608.064-.261.017-.538-.128-.748-.145-.21-.361-.348-.61-.348-.248 0-.465.138-.61.348-.145.21-.192.487-.128.748.064.261.231.478.459.608.228.13.504.15.748.055.244-.095.438-.285.543-.529.106-.244.082-.515-.063-.734-.164-.251-.432-.407-.734-.45-.263-.036-.581.03-.75.254z"/>
            </svg>
            支付宝
          </button>
        </div>
      </form>
    </div>
  );
}
