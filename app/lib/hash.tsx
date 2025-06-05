import type { ItemInCart } from "../types/item";

export const computeHash = (itemInCart: ItemInCart) => {
  // 计算购物车商品的哈希值，用于判断商品SKU
  return `${itemInCart.name}-${itemInCart.optionsSelected.cup?.name}-${itemInCart.optionsSelected.sugar?.name}-${itemInCart.optionsSelected.temperature?.name}`;
};