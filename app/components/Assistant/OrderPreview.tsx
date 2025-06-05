import type { ItemInCart } from "~/types/item";


export default function OrderPreview() {

    return (
        <div>
            <h1>Order Preview</h1>
        </div>
    )
}

// export default function OrderPreview({ orderItems, onAddToCart }): {
//   orderItems: OrderItem[];
//   onAddToCart: () => void;
// } {
//   if (!orderItems || orderItems.length === 0) return null;

//   return (
//     <div className="bg-white rounded-lg p-4 space-y-3 shadow-lg border border-gray-200">
//       <div className="text-lg font-medium text-gray-800 mb-3">订单确认</div>

//       {/* 订单商品列表 */}
//       {orderItems.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
//         >
//           <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
//             <svg
//               className="w-8 h-8 text-amber-500"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M2 21v-2h18v2H2zM3 9v8h16V9h2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V9h2zm16-4V3h-2v2H5V3H3v2H1v2h20V5h-2zM6 7h12v2H6V7z" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <div className="font-medium text-gray-800">{item.coffee.name}</div>
//             <div className="text-gray-500 text-sm">
//               {item.selectedCup?.name} / {item.selectedTemperature?.name} /{" "}
//               {item.selectedSugar?.name}
//             </div>
//             <div className="mt-1 flex items-center justify-between">
//               <div className="text-amber-600 font-medium">
//                 ¥
//                 {((item.coffee.basePrice || 0) +
//                   (item.selectedCup?.addPrice || 0) +
//                   (item.selectedSugar?.addPrice || 0) +
//                   (item.selectedTemperature?.addPrice || 0)) *
//                   item.quantity}
//               </div>
//               <div className="text-gray-500">x{item.quantity}</div>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* 添加到购物车按钮 */}
//       <button
//         onClick={onAddToCart}
//         className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
//       >
//         加入购物车
//       </button>
//     </div>
//   );
// }
