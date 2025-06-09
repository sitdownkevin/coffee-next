import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/login";
import AnimatedBackground from "~/components/Login/AnimatedBackground";
import LoginForm from "~/components/Login/LoginForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "登录 - Coffee Next" },
    { name: "description", content: "Coffee Next 登录页面" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 检查是否已经登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('coffee-next-user');
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (phone: string) => {
    setIsLoading(true);
    
    // 模拟登录过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 保存用户信息到本地存储
    const userData = {
      phone,
      name: '咖啡爱好者',
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem('coffee-next-user', JSON.stringify(userData));
    
    // 登录成功后跳转到主页
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* 动画背景 */}
      <AnimatedBackground />
      
      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部装饰区域 */}
        <div className="flex-1 flex items-center justify-center px-6 pt-16 pb-8">
          <div className="w-full max-w-sm">
            {/* Logo 和标题区域 */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float-bounce">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 5 18.5 5V3zM16 5v3c0 2.76-2.24 5-5 5s-5-2.24-5-5V5h10z"/>
                  <circle cx="9" cy="8" r="1"/>
                  <circle cx="15" cy="8" r="1"/>
                  <path d="M18 2l1.5-1.5L21 2l-1.5 1.5L18 2zM12 2l1.5-1.5L15 2l-1.5 1.5L12 2zM6 2l1.5-1.5L9 2L7.5 3.5 6 2z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Coffee Next</h1>
              <p className="text-gray-600 text-lg">下一代咖啡订购体验</p>
            </div>

            {/* 登录表单 */}
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="pb-8 px-6">
          <div className="text-center text-sm text-gray-500 animate-fade-in-up animate-delay-700">
            <p>登录即表示您同意我们的</p>
            <div className="flex justify-center space-x-4 mt-1">
              <button className="text-amber-600 hover:text-amber-700 transition-colors">
                服务条款
              </button>
              <span>·</span>
              <button className="text-amber-600 hover:text-amber-700 transition-colors">
                隐私政策
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
