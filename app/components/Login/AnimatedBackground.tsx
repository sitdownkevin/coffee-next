export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 浮动的咖啡豆装饰 */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-amber-400 rounded-full opacity-20 animate-float-bounce"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-orange-400 rounded-full opacity-30 animate-float-bounce animate-delay-300"></div>
      <div className="absolute top-48 left-20 w-2 h-2 bg-yellow-400 rounded-full opacity-25 animate-float-bounce animate-delay-500"></div>
      <div className="absolute top-64 right-8 w-5 h-5 bg-amber-300 rounded-full opacity-20 animate-float-bounce animate-delay-700"></div>
      
      {/* 大型装饰圆圈 */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-30 animate-spin-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full opacity-25 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      
      {/* 中型装饰圆圈 */}
      <div className="absolute top-1/3 -left-10 w-24 h-24 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-10 w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-25 animate-pulse animate-delay-300"></div>
      
      {/* 咖啡蒸汽效果 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          <div className="w-1 h-8 bg-gradient-to-t from-transparent to-amber-300 rounded-full opacity-40 animate-wave"></div>
          <div className="w-1 h-6 bg-gradient-to-t from-transparent to-orange-300 rounded-full opacity-30 animate-wave animate-delay-300"></div>
          <div className="w-1 h-10 bg-gradient-to-t from-transparent to-yellow-300 rounded-full opacity-35 animate-wave animate-delay-500"></div>
        </div>
      </div>
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10"></div>
    </div>
  );
}
