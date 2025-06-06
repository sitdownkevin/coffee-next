import type { ItemInCart } from "~/types/item";
import { computeHash } from "~/lib/hash";

import { useState, useEffect } from "react";

export function OrderPreview({
  itemsInChat,
  handleAddToCart,
}: {
  itemsInChat: ItemInCart[];
  handleAddToCart: (itemInCart: ItemInCart) => void;
}) {
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
          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
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

      <div className="pt-4 border-t border-gray-100 mt-2">
        <button
          className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 px-4 font-semibold text-lg rounded-full hover:bg-amber-600 active:scale-95 transform transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={addToCart}  
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>加入购物车</span>
        </button>
      </div>
    </div>
  );
}
