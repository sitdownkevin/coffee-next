import type { ItemInCart } from "~/types/item";
import { computeHash } from "~/lib/hash";

import { useState, useEffect } from "react";

export default function OrderPreview({
  itemsInChat,
  handleAddToCart,
}: {
  itemsInChat: ItemInCart[];
  handleAddToCart: (itemInCart: ItemInCart) => void;
}) {
  // const [itemsInCart, setItemsInCart] = useState<ItemInCart[]>([]);
  const [itemsInCartToAdd, setItemsInCartToAdd] = useState<ItemInCart[]>([]);

  const addToCart = () => {
    console.log("addToCart", itemsInCartToAdd);
    itemsInCartToAdd.forEach((item) => {
      handleAddToCart(item);
    });
  }

  useEffect(() => {
    const newItemsInCart: ItemInCart[] = [];

    for (const item of itemsInChat) {
      if (!item) {
        continue;
      }

      const hash = computeHash(item);

      if (newItemsInCart.find((item) => item.hash === hash)) {
        newItemsInCart.find((item) => item.hash === hash)!.quantity +=
          item.quantity;
      } else {
        newItemsInCart.push({
          ...item,
          hash: hash,
        });
      }
    }
    setItemsInCartToAdd(newItemsInCart);
  }, [itemsInChat]);

  return (
    <div className="bg-white rounded-lg p-4 space-y-3 shadow-lg border border-gray-200 w-full">
      <div className="text-lg font-medium text-gray-800 mb-3">订单确认</div>

      {itemsInCartToAdd.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2 21v-2h18v2H2zM3 9v8h16V9h2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V9h2zm16-4V3h-2v2H5V3H3v2H1v2h20V5h-2zM6 7h12v2H6V7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{item.name}</div>
            <div className="text-gray-500 text-sm">
              {[
                item.optionsSelected.cup?.name,
                item.optionsSelected.sugar?.name,
                item.optionsSelected.temperature?.name
              ]
                .filter(Boolean)
                .join(" / ")}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-amber-600 font-medium">
                ¥
                {item.basePrice +
                  (item.optionsSelected.cup?.addPrice || 0) +
                  (item.optionsSelected.sugar?.addPrice || 0) +
                  (item.optionsSelected.temperature?.addPrice || 0)}
              </div>
              <div className="text-gray-500">x{item.quantity}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          className="bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          onClick={() => {
            addToCart();
          }}  
        >
          加入购物车
        </button>
      </div>
    </div>
  );
}
