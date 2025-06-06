import { useState } from "react";
import { items } from "../data/items";
import type { Route } from "./+types/home";
import type { Item, ItemInCart } from "../types/item";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Coffee Next - Next Coffee Order System" },
    { name: "description", content: "Next Coffee Order System" },
  ];
}

import Toast from "~/components/Home/Toast";
import Header from "~/components/Home/Header";
import Main from "~/components/Home/Main";
import Cart from "~/components/Cart";
import Assistant from "~/components/Home/Assistant";

export default function Home() {
  // Toast
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Item List
  const [itemSelected, setItemSelected] = useState<Item | null>(null);

  // Cart
  const [cartButtonAnimation, setCartButtonAnimation] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemsInCart, setItemsInCart] = useState<ItemInCart[]>([]);

  // Chat
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelect = (itemSelected: Item) => {
    setItemSelected(itemSelected);
    // 移动端点击商品后打开详情页面
    setIsMobileDetailOpen(true);
  };

  // 关闭移动端详情页面
  const handleCloseMobileDetail = () => {
    setIsMobileDetailOpen(false);
  };

  // 添加商品到购物车
  const handleAddToCart = (itemInCart: ItemInCart) => {
    // 使用函数式状态更新，确保多个连续调用不会互相覆盖
    setItemsInCart((prevItemsInCart) => {
      // 判断购物车中是否已存在该商品
      const existingItem = prevItemsInCart.find((item) => item.hash === itemInCart.hash);
      if (existingItem) {
        // 如果已存在，则更新商品数量
        return prevItemsInCart.map((item) => 
          item.hash === itemInCart.hash 
            ? { ...item, quantity: item.quantity + itemInCart.quantity } 
            : item
        );
      } else {
        // 如果不存在，则添加到购物车
        return [...prevItemsInCart, itemInCart];
      }
    });

    if (isChatOpen) {
      setIsChatOpen(false);
      setTimeout(() => {
        setIsCartOpen(true);
      }, 500);
    }

    // 显示成功提示Toast
    setToastMessage(`${itemInCart.name} 已添加到购物车`);
    setShowToast(true);

    // 购物车按钮动画效果 - 优化时间
    setCartButtonAnimation(true);

    // 2.5秒后隐藏Toast
    setTimeout(() => {
      setShowToast(false);
    }, 2500);

    // 0.8秒后结束按钮动画
    setTimeout(() => {
      setCartButtonAnimation(false);
    }, 800);
  };

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // 切换聊天窗口
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Toast 提示组件 - 统一的通知系统 */}
      {showToast && <Toast toastMessage={toastMessage} />}

      {/* 头部区域 */}
      <Header
        itemsInCart={itemsInCart}
        handleToggleCart={handleToggleCart}
        cartButtonAnimation={cartButtonAnimation}
      />

      {/* 购物车组件 */}
      <Cart
        itemsInCart={itemsInCart}
        setItemsInCart={setItemsInCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* 主内容区域 */}
      <Main
        items={items}
        itemSelected={itemSelected}
        handleSelect={handleSelect}
        handleAddToCart={handleAddToCart}
        isMobileDetailOpen={isMobileDetailOpen}
        handleCloseMobileDetail={handleCloseMobileDetail}
      />

      {/* 悬浮客服聊天窗口 */}
      <Assistant
        isChatOpen={isChatOpen}
        handleToggleChat={handleToggleChat}
        handleAddToCart={handleAddToCart}
      />

    </div>
  );
}
