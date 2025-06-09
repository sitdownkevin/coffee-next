export interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  minAmount?: number; // 最低消费金额
  validDays: number; // 有效天数
  type: 'discount' | 'freebie' | 'percentage'; // 优惠类型
  value: number; // 优惠值（金额或百分比）
  emoji: string; // 表情符号
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  isLimited?: boolean; // 是否限量
  stock?: number; // 库存数量
}

export interface UserCoupon extends Coupon {
  receivedAt: string;
  expiresAt: string;
  isUsed: boolean;
}
