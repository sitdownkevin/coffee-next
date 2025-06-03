import { useState, useCallback } from 'react';
import type { CartItem, Cart } from '../types/cart';
import type { Coffee, CoffeeOption } from '../types/coffee';

interface AddToCartItem {
  coffee: Coffee;
  selectedCup: CoffeeOption;
  selectedSugar: CoffeeOption;
  selectedTemperature: CoffeeOption;
  quantity: number;
  totalPrice: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  const generateItemId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const calculateUnitPrice = (item: AddToCartItem) => {
    return item.coffee.basePrice + 
           item.selectedCup.addPrice + 
           item.selectedSugar.addPrice + 
           item.selectedTemperature.addPrice;
  };

  const updateCartTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return { totalItems, totalPrice };
  };

  const addToCart = useCallback((newItem: AddToCartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => 
        item.coffee.name === newItem.coffee.name &&
        item.selectedCup.name === newItem.selectedCup.name &&
        item.selectedSugar.name === newItem.selectedSugar.name &&
        item.selectedTemperature.name === newItem.selectedTemperature.name
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // 如果商品已存在，增加数量
        updatedItems = prevCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + newItem.quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity
            };
          }
          return item;
        });
      } else {
        // 如果是新商品，添加到购物车
        const unitPrice = calculateUnitPrice(newItem);
        const cartItem: CartItem = {
          id: generateItemId(),
          coffee: newItem.coffee,
          selectedCup: newItem.selectedCup,
          selectedSugar: newItem.selectedSugar,
          selectedTemperature: newItem.selectedTemperature,
          quantity: newItem.quantity,
          unitPrice,
          totalPrice: unitPrice * newItem.quantity
        };
        updatedItems = [...prevCart.items, cartItem];
      }

      const { totalItems, totalPrice } = updateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const { totalItems, totalPrice } = updateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      });

      const { totalItems, totalPrice } = updateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
} 