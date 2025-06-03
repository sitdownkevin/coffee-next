import type { Coffee } from "../types/coffee";

interface CoffeeListProps {
  coffees: Coffee[];
  selectedCoffee: Coffee | null;
  onSelectCoffee: (coffee: Coffee) => void;
}

export default function CoffeeList({ coffees, selectedCoffee, onSelectCoffee }: CoffeeListProps) {
  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">菜单</h2>
        <p className="text-sm text-gray-500 mt-1">选择您喜欢的咖啡</p>
      </div>
      
      <div className="p-2">
        {coffees.map((coffee, index) => (
          <div
            key={index}
            onClick={() => onSelectCoffee(coffee)}
            className={`
              p-4 m-2 rounded-lg cursor-pointer transition-all duration-200 border
              ${selectedCoffee?.name === coffee.name 
                ? 'bg-amber-50 border-amber-300 shadow-md' 
                : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{coffee.name}</h3>
                <p className="text-amber-600 font-bold mt-1">¥{coffee.basePrice}</p>
              </div>
              <div className="text-2xl">
                {getCoffeeEmoji(coffee.name)}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              <span>{coffee.cups.length} 种规格 • </span>
              <span>{coffee.sugars.length} 种糖度 • </span>
              <span>{coffee.temperatures.length} 种温度</span>
            </div>
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
    '白咖啡': '🥛'
  };
  return emojiMap[coffeeName] || '☕';
} 