import { useState } from "react";
import type { Coupon } from "~/types/coupon";

interface CouponCardProps {
  coupon: Coupon;
  onReceive: (coupon: Coupon) => void;
  isReceiving: boolean;
  isReceived: boolean;
}

export default function CouponCard({ coupon, onReceive, isReceiving, isReceived }: CouponCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleReceive = () => {
    if (!isReceiving && !isReceived) {
      onReceive(coupon);
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform
        bg-gradient-to-br ${coupon.color.bg} text-white shadow-lg
        ${isHovered ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
        ${isReceived ? 'opacity-60' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <div className="absolute top-4 right-4 text-6xl transform rotate-12">
          {coupon.emoji}
        </div>
      </div>
      
      {/* 限量标签 */}
      {coupon.isLimited && coupon.stock && coupon.stock > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
          限量 {coupon.stock} 张
        </div>
      )}

      {/* 已领取标签 */}
      {isReceived && (
        <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded-full font-bold">
          已领取
        </div>
      )}

      {/* 主要内容 */}
      <div className="relative z-10">
        {/* 优惠券标题 */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-3xl">{coupon.emoji}</span>
          <h3 className="text-xl font-bold">{coupon.title}</h3>
        </div>

        {/* 优惠内容 */}
        <div className="mb-4">
          <div className="text-2xl font-black mb-1">{coupon.discount}</div>
          <p className="text-sm opacity-90 leading-relaxed">{coupon.description}</p>
        </div>

        {/* 使用条件 */}
        <div className="flex items-center justify-between text-xs opacity-80 mb-4">
          {coupon.minAmount && (
            <span>满¥{coupon.minAmount}可用</span>
          )}
          <span>有效期{coupon.validDays}天</span>
        </div>

        {/* 领取按钮 */}
        <button
          onClick={handleReceive}
          disabled={isReceiving || isReceived || (coupon.isLimited && coupon.stock === 0)}
          className={`
            w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 transform
            ${isReceived 
              ? 'bg-gray-500 cursor-not-allowed' 
              : isReceiving
                ? 'bg-white/20 cursor-not-allowed'
                : 'bg-white/90 hover:bg-white text-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isReceiving ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>领取中...</span>
            </div>
          ) : isReceived ? (
            '已领取'
          ) : coupon.isLimited && coupon.stock === 0 ? (
            '已抢完'
          ) : (
            '立即领取'
          )}
        </button>
      </div>

      {/* 装饰性边框 */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"></div>
      
      {/* 闪光效果 */}
      {isHovered && !isReceived && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
      )}
    </div>
  );
}
