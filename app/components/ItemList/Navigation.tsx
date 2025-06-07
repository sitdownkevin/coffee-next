import { ItemType } from "../../types/item";

export const itemTypeConfig: Record<ItemType, { label: string; emoji: string }> = {
  [ItemType.Coffee]: { label: "咖啡", emoji: "☕" },
  [ItemType.Juice]: { label: "果汁", emoji: "🧃" },
  [ItemType.Tea]: { label: "茶", emoji: "🍵" },
  [ItemType.Dessert]: { label: "甜品", emoji: "🍰" },
  [ItemType.Salad]: { label: "沙拉", emoji: "🥗" },
  [ItemType.Milk]: { label: "牛奶", emoji: "🥛" },
  [ItemType.Snack]: { label: "小食", emoji: "🥐" },
};


export interface NavItem {
  id: string;
  label: string;
  type: ItemType;
}


export function Navigation({
  navItems,
  scrollToSection,
  activeSection,
}: {
  navItems: NavItem[];
  scrollToSection: (sectionId: string) => void;
  activeSection: string;
}) {
  return (
    <div className="hidden md:block w-20 lg:w-24 bg-gray-100 flex-shrink-0 overflow-y-auto touch-scroll">
      <div className="py-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            onTouchStart={() => {}} // Ensures touch events work on mobile
            className={`w-full text-center py-3 px-1 text-xs font-medium transition-all duration-200 touch-button border-b border-gray-200 ${
              activeSection === item.id
                ? "bg-gray-800 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm">{itemTypeConfig[item.type].emoji}</span>
              <span className="text-xs leading-tight">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
