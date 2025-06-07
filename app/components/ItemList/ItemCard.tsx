import type { Item } from "~/types/item";

export function ItemCard({
  item,
  itemSelected,
  handleSelect,
}: {
  item: Item;
  itemSelected: Item | null;
  handleSelect: (item: Item) => void;
}) {
  return (
    <div
      onClick={() => handleSelect(item)}
      className={`
                p-3 md:p-4 m-1 md:m-2 rounded-lg cursor-pointer transition-all duration-200 border
                ${
                  itemSelected?.name === item.name
                    ? "bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-200"
                    : "bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200 active:bg-amber-100"
                }
                transform active:scale-95 md:active:scale-100
              `}
    >
      <div className="flex justify-between items-start mb-2 md:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-base md:text-lg truncate">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-amber-600 font-bold text-sm md:text-base">
              ¥{item.basePrice}
            </p>
          </div>
        </div>
        <div className="text-xl md:text-2xl ml-2 flex-shrink-0">
          {getItemEmoji(item.name)}
        </div>
      </div>

      {/* 咖啡描述 */}
      <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="text-xs text-gray-500 flex flex-wrap gap-1">
        {item.options.cup && (
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {item.options.cup.length} 种规格
          </span>
        )}
        {item.options.sugar && (
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {item.options.sugar.length} 种糖度
          </span>
        )}
        {item.options.temperature && (
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {item.options.temperature.length} 种温度
          </span>
        )}
      </div>
    </div>
  );
}

function getItemEmoji(itemName: string): string {
  const emojiMap: { [key: string]: string } = {
    // 咖啡类
    美式: "☕",
    拿铁: "🥛",
    卡布奇诺: "☕",
    摩卡: "🍫",
    焦糖玛奇朵: "🍮",
    浓缩咖啡: "☕",
    香草拿铁: "🌿",
    榛果拿铁: "🌰",
    冰美式: "🧊",
    白咖啡: "🥛",
    抹茶拿铁: "🍵",
    桂花拿铁: "🌼",
    燕麦拿铁: "🌾",
    椰香摩卡: "🥥",
    气泡美式: "💫",
    肉桂拿铁: "🌰",
    蜂蜜拿铁: "🍯",
    黑糖玛奇朵: "🖤",
    柠檬气泡咖啡: "🍋",
    玫瑰拿铁: "🌹",
    // 果汁类
    手打柠檬茶: "🍋",
    // 茶类
    乌龙茶: "🍵",
    茉莉花茶: "🌸",
    红茶: "🍵",
    // 甜品类
    提拉米苏: "🍰",
    芝士蛋糕: "🧀",
    巧克力布朗尼: "🍫",
    抹茶千层: "🍃",
    马卡龙礼盒: "🌈",
    // 沙拉类
    凯撒沙拉: "🥗",
    牛油果鸡胸沙拉: "🥑",
    藜麦蔬菜沙拉: "🌱",
    地中海风情沙拉: "🫒",
    // 牛奶类
    燕麦牛奶: "🌾",
    杏仁牛奶: "🌰",
    椰奶: "🥥",
    有机全脂牛奶: "🥛",
    // 小食类
    牛角包: "🥐",
    三明治: "🥪",
    能量棒: "🍫",
    酸奶杯: "🥛",
    坚果混合: "🥜",
  };
  return emojiMap[itemName] || "🍴";
}
