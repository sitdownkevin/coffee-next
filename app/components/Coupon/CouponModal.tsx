import { useState, useEffect } from "react";
import type { Coupon, UserCoupon } from "~/types/coupon";
import { availableCoupons } from "~/data/discount";
import CouponCard from "./CouponCard";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponModal({ isOpen, onClose }: CouponModalProps) {
  const [receivingCoupons, setReceivingCoupons] = useState<Set<string>>(new Set());
  const [receivedCoupons, setReceivedCoupons] = useState<Set<string>>(new Set());
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [lastReceivedCoupon, setLastReceivedCoupon] = useState<Coupon | null>(null);

  // 从本地存储加载已领取的优惠券
  useEffect(() => {
    const savedCoupons = localStorage.getItem('coffee-next-received-coupons');
    if (savedCoupons) {
      try {
        const userCoupons: UserCoupon[] = JSON.parse(savedCoupons);
        const receivedIds = new Set(userCoupons.map(c => c.id));
        setReceivedCoupons(receivedIds);
      } catch (error) {
        console.error('解析优惠券数据失败:', error);
      }
    }
  }, []);

  const handleReceiveCoupon = async (coupon: Coupon) => {
    if (receivingCoupons.has(coupon.id) || receivedCoupons.has(coupon.id)) {
      return;
    }

    // 设置领取状态
    setReceivingCoupons(prev => new Set([...prev, coupon.id]));

    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 创建用户优惠券
    const userCoupon: UserCoupon = {
      ...coupon,
      receivedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + coupon.validDays * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
    };

    // 保存到本地存储
    const existingCoupons = localStorage.getItem('coffee-next-received-coupons');
    const userCoupons: UserCoupon[] = existingCoupons ? JSON.parse(existingCoupons) : [];
    userCoupons.push(userCoupon);
    localStorage.setItem('coffee-next-received-coupons', JSON.stringify(userCoupons));

    // 更新状态
    setReceivedCoupons(prev => new Set([...prev, coupon.id]));
    setReceivingCoupons(prev => {
      const newSet = new Set(prev);
      newSet.delete(coupon.id);
      return newSet;
    });

    // 显示成功动画
    setLastReceivedCoupon(coupon);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 3000);
  };

  const handleClose = () => {
    if (!Array.from(receivingCoupons).length) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className={`
          fixed inset-0 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={handleClose}
        style={{ 
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)' 
            : 'transparent'
        }}
      />
      
      {/* 优惠券弹窗 */}
      <div 
        className={`
          fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50
          max-w-md mx-auto max-h-[80vh] overflow-hidden
          bg-gradient-to-br from-white via-gray-50 to-white
          rounded-3xl shadow-2xl border border-gray-200
          transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <div className="absolute top-2 right-2 text-6xl animate-float-bounce">🎁</div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">优惠券中心</h2>
              <p className="text-sm opacity-90">领取专属优惠，享受更多折扣</p>
            </div>
            <button
              onClick={handleClose}
              disabled={receivingCoupons.size > 0}
              className={`
                p-2 rounded-full transition-all duration-200
                ${receivingCoupons.size > 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/20 active:scale-95'
                }
              `}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 优惠券列表 */}
        <div className="p-6 overflow-y-auto max-h-96 space-y-4">
          {availableCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onReceive={handleReceiveCoupon}
              isReceiving={receivingCoupons.has(coupon.id)}
              isReceived={receivedCoupons.has(coupon.id)}
            />
          ))}
        </div>

        {/* 底部提示 */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            优惠券将自动保存到您的账户，可在结算时使用
          </p>
        </div>
      </div>

      {/* 成功动画 */}
      {showSuccessAnimation && lastReceivedCoupon && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 animate-fade-in-up">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">{lastReceivedCoupon.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">领取成功！</h3>
              <p className="text-gray-600 mb-4">{lastReceivedCoupon.title}</p>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
