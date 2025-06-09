export const discount = [
    "全场满100元减10元",
    "拿铁买一送一",
    "咖啡全场7折",
]

import type { Coupon } from "../types/coupon";

export const availableCoupons: Coupon[] = [
  {
    id: "welcome-10",
    title: "新用户专享",
    description: "全场满50元减10元",
    discount: "满50减10",
    minAmount: 50,
    validDays: 30,
    type: "discount",
    value: 10,
    emoji: "🎉",
    color: {
      bg: "from-pink-400 to-red-500",
      border: "border-pink-300",
      text: "text-pink-800",
      accent: "text-red-600"
    },
    isLimited: true,
    stock: 100
  },
  {
    id: "latte-bogo",
    title: "拿铁买一送一",
    description: "购买任意拿铁即可获得同款免费拿铁一杯",
    discount: "买一送一",
    validDays: 7,
    type: "freebie",
    value: 1,
    emoji: "☕",
    color: {
      bg: "from-amber-400 to-orange-500",
      border: "border-amber-300",
      text: "text-amber-800",
      accent: "text-orange-600"
    },
    isLimited: true,
    stock: 50
  },
  {
    id: "coffee-30off",
    title: "咖啡全场7折",
    description: "所有咖啡类饮品享受7折优惠",
    discount: "全场7折",
    validDays: 14,
    type: "percentage",
    value: 30,
    emoji: "💰",
    color: {
      bg: "from-green-400 to-emerald-500",
      border: "border-green-300",
      text: "text-green-800",
      accent: "text-emerald-600"
    }
  },
  {
    id: "dessert-free",
    title: "免费甜品",
    description: "消费满80元即可免费获得提拉米苏一份",
    discount: "满80送甜品",
    minAmount: 80,
    validDays: 10,
    type: "freebie",
    value: 28,
    emoji: "🍰",
    color: {
      bg: "from-purple-400 to-indigo-500",
      border: "border-purple-300",
      text: "text-purple-800",
      accent: "text-indigo-600"
    },
    isLimited: true,
    stock: 30
  }
];