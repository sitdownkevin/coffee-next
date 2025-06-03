import type { Coffee } from "../types/coffee";

interface CoffeeListProps {
  coffees: Coffee[];
  selectedCoffee: Coffee | null;
  onSelectCoffee: (coffee: Coffee) => void;
}

export default function CoffeeList({ coffees, selectedCoffee, onSelectCoffee }: CoffeeListProps) {
  return (
    <div className="h-full bg-white md:border-r border-gray-200 overflow-y-auto mobile-scroll">
      <div className="p-3 md:p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">菜单</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">选择您喜欢的咖啡</p>
      </div>
      
      <div className="p-1 md:p-2 pb-20 md:pb-4">
        {coffees.map((coffee, index) => (
          <div
            key={index}
            onClick={() => onSelectCoffee(coffee)}
            className={`
              p-3 md:p-4 m-1 md:m-2 rounded-lg cursor-pointer transition-all duration-200 border
              ${selectedCoffee?.name === coffee.name 
                ? 'bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-200' 
                : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200 active:bg-amber-100'
              }
              transform active:scale-95 md:active:scale-100
            `}
          >
            <div className="flex justify-between items-start mb-2 md:mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-base md:text-lg truncate">{coffee.name}</h3>
                <p className="text-amber-600 font-bold mt-1 text-sm md:text-base">¥{coffee.basePrice}</p>
              </div>
              <div className="text-xl md:text-2xl ml-2 flex-shrink-0">
                {getCoffeeEmoji(coffee.name)}
              </div>
            </div>
            
            {/* 咖啡描述 */}
            <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">{coffee.description}</p>
            
            <div className="text-xs text-gray-500 flex flex-wrap gap-1">
              <span className="bg-gray-100 px-2 py-1 rounded-full">{coffee.cups.length} 种规格</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full">{coffee.sugars.length} 种糖度</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full">{coffee.temperatures.length} 种温度</span>
            </div>

            {/* 移动端选中状态指示器 */}
            {selectedCoffee?.name === coffee.name && (
              <div className="md:hidden flex items-center justify-center mt-3 pt-2 border-t border-amber-200">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <span>✓</span>
                  <span>已选中</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getCoffeeEmoji(coffeeName: string): string {
  const emojiMap: { [key: string]: string } = {
    '美式': '☕',
    '拿铁': '🥛',
    '卡布奇诺': '☕',
    '摩卡': '🍫',
    '焦糖玛奇朵': '🍮',
    '浓缩咖啡': '☕',
    '香草拿铁': '🌿',
    '榛果拿铁': '🌰',
    '冰美式': '🧊',
    '白咖啡': '🥛',
    '抹茶拿铁': '🍵',
    '桂花拿铁': '🌼',
    '燕麦拿铁': '🌾',
    '椰香摩卡': '🥥',
    '气泡美式': '💫',
    '肉桂拿铁': '🌰',
    '蜂蜜拿铁': '🍯',
    '黑糖玛奇朵': '🖤',
    '柠檬气泡咖啡': '🍋',
    '玫瑰拿铁': '🌹'
  };
  return emojiMap[coffeeName] || '☕';
} 