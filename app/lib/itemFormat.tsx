import type { ItemInCart, ItemSelected, ItemSelectedQwen } from "~/types/item";

import { items } from "~/data/items";
import { computeHash } from "./hash";

export function transformItemSelectedToItemInCartQwen(itemSelectedQwen: ItemSelectedQwen): ItemInCart | null {
  const item = items.find((item) => item.name === itemSelectedQwen.name);
  if (!item) {
    return null;
  }

  const itemInCart: ItemInCart = {
    name: item.name,
    description: item.description,
    type: item.type,
    basePrice: item.basePrice,
    options: item.options,
    optionsSelected: {
      cup: item.options.cup?.find((option) => option.name === itemSelectedQwen.cup) || item.options.cup?.[0],
      sugar: item.options.sugar?.find((option) => option.name === itemSelectedQwen.sugar) || item.options.sugar?.[0],
      temperature: item.options.temperature?.find((option) => option.name === itemSelectedQwen.temperature) || item.options.temperature?.[0],
    },
    quantity: itemSelectedQwen.quantity,
    hash: "",
  }

  itemInCart.hash = computeHash(itemInCart);

  return itemInCart;
}


export function transformItemSelectedToItemInCart(itemSelected: ItemSelected): ItemInCart | null {
  const item = items.find((item) => item.name === itemSelected.name);
  if (!item) {
    return null;
  }

  const itemInCart: ItemInCart = {
    name: item.name,
    description: item.description,
    type: item.type,
    basePrice: item.basePrice,
    options: item.options,
    optionsSelected: {
      cup: item.options.cup?.find((option) => option.name === itemSelected.options.cup) || item.options.cup?.[0],
      sugar: item.options.sugar?.find((option) => option.name === itemSelected.options.sugar) || item.options.sugar?.[0],
      temperature: item.options.temperature?.find((option) => option.name === itemSelected.options.temperature) || item.options.temperature?.[0],
    },
    quantity: itemSelected.quantity,
    hash: "",
  }

  itemInCart.hash = computeHash(itemInCart);

  return itemInCart;
}