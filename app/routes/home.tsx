import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import MicrophoneLoader from "~/components/Home/MicrophoneLoader";

export default function Home() {
  const navigate = useNavigate();

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('coffee-next-user');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  // 麦克风权限状态
  const [microphoneStatus, setMicrophoneStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  
  // 请求麦克风权限的函数
  const requestMicrophonePermission = async () => {
    setMicrophoneStatus('loading');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("麦克风权限已获取");
      // 获取权限后，可以关闭媒体流，以节省资源
      stream.getTracks().forEach(track => track.stop());
      setMicrophoneStatus('granted');
    } catch (err) {
      console.error("获取麦克风权限失败:", err);
      setMicrophoneStatus('denied');
    }
  };

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Item List
  const [itemSelected, setItemSelected] = useState<Item | null>(null);

  // Cart
  const [cartButtonAnimation, setCartButtonAnimation] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemsInCart, setItemsInCart] = useState<ItemInCart[]>([]);
  const [editingItem, setEditingItem] = useState<ItemInCart | null>(null);

  // Chat
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelect = (itemSelected: Item) => {
    setItemSelected(itemSelected);
    // 移动端点击商品后打开详情页面
    setIsMobileDetailOpen(true);
    setEditingItem(null); // 清除编辑状态
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

  const handleUpdateItemInCart = (updatedItem: ItemInCart) => {
    setItemsInCart((prevItemsInCart) => {
      return prevItemsInCart.map((item) =>
        item.hash === editingItem?.hash ? updatedItem : item
      );
    });

    // 清除编辑状态
    setEditingItem(null);
    setIsMobileDetailOpen(false); // 关闭详情页

    // 延迟打开购物车，让页面关闭动画更流畅
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);

    // 显示成功提示Toast
    setToastMessage(`${updatedItem.name} 已更新`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // 切换聊天窗口
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* 麦克风权限获取加载页面 */}
      <MicrophoneLoader 
        isLoading={microphoneStatus === 'loading'}
        hasError={microphoneStatus === 'denied'}
        onRetry={requestMicrophonePermission}
      />

      {/* 主应用页面 - 只在权限获取成功后显示 */}
      {microphoneStatus === 'granted' && (
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
            setEditingItem={setEditingItem}
            setIsMobileDetailOpen={setIsMobileDetailOpen}
          />

          {/* 主内容区域 */}
          <Main
            items={items}
            itemSelected={itemSelected}
            handleSelect={handleSelect}
            handleAddToCart={handleAddToCart}
            isMobileDetailOpen={isMobileDetailOpen}
            handleCloseMobileDetail={handleCloseMobileDetail}
            editingItem={editingItem}
            handleUpdateItemInCart={handleUpdateItemInCart}
            setEditingItem={setEditingItem}
          />

          {/* 悬浮客服聊天窗口 */}
          <Assistant
            isChatOpen={isChatOpen}
            handleToggleChat={handleToggleChat}
            handleAddToCart={handleAddToCart}
          />
        </div>
      )}
    </>
  );
}
