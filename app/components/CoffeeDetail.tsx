import { useState, useEffect } from "react";
import type { Coffee, CoffeeOption } from "../types/coffee";

interface CoffeeDetailProps {
  coffee: Coffee | null;
  onAddToCart?: (orderDetails: {
    coffee: Coffee;
    selectedCup: CoffeeOption;
    selectedSugar: CoffeeOption;
    selectedTemperature: CoffeeOption;
    quantity: number;
    totalPrice: number;
  }) => void;
}

export default function CoffeeDetail({ coffee, onAddToCart }: CoffeeDetailProps) {
  const [selectedCup, setSelectedCup] = useState<CoffeeOption | null>(null);
  const [selectedSugar, setSelectedSugar] = useState<CoffeeOption | null>(null);
  const [selectedTemperature, setSelectedTemperature] = useState<CoffeeOption | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 当选择的咖啡改变时，重置选项
  useEffect(() => {
    if (coffee) {
      setSelectedCup(coffee.cups?.[0] || null);
      setSelectedSugar(coffee.sugars?.[0] || null);
      setSelectedTemperature(coffee.temperatures?.[0] || null);
      setQuantity(1);
    }
  }, [coffee]);

  if (!coffee) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <div className="text-4xl md:text-6xl mb-4">☕</div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">请选择一款咖啡</h3>
          <p className="text-sm md:text-base">从菜单中选择您喜欢的咖啡</p>
        </div>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    let total = coffee.basePrice;
    if (selectedCup) total += selectedCup.addPrice;
    if (selectedSugar) total += selectedSugar.addPrice;
    if (selectedTemperature) total += selectedTemperature.addPrice;
    return total * quantity;
  };

  const handleAddToCart = () => {
    // 检查必需的选项是否已选择
    const hasRequiredCup = !coffee.cups || coffee.cups.length === 0 || selectedCup;
    const hasRequiredSugar = !coffee.sugars || coffee.sugars.length === 0 || selectedSugar;
    const hasRequiredTemperature = !coffee.temperatures || coffee.temperatures.length === 0 || selectedTemperature;
    
    if (hasRequiredCup && hasRequiredSugar && hasRequiredTemperature && onAddToCart) {
      onAddToCart({
        coffee,
        selectedCup: selectedCup || { name: "默认", addPrice: 0 },
        selectedSugar: selectedSugar || { name: "默认", addPrice: 0 },
        selectedTemperature: selectedTemperature || { name: "默认", addPrice: 0 },
        quantity,
        totalPrice: calculateTotalPrice()
      });
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto mobile-scroll">
      <div className="p-4 md:p-6 pb-20 md:pb-6">
        {/* 商品图片 */}
        {/* <div className="mb-6 md:mb-8">
          <div className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop"
              alt={coffee.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div> */}

        {/* 咖啡标题 */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-6xl mb-3 md:mb-4">
            {getCoffeeEmoji(coffee.name)}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{coffee.name}</h2>
          <p className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4 max-w-md mx-auto leading-relaxed px-2">{coffee.description}</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-xl md:text-2xl text-amber-600 font-bold">¥{coffee.basePrice}</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(coffee.type)}`}>
              {getTypeName(coffee.type)}
            </span>
          </div>
        </div>

        {/* 规格选择 */}
        {coffee.cups && coffee.cups.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">选择规格</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {coffee.cups.map((cup, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCup(cup)}
                  className={`
                    p-2 md:p-3 rounded-lg border transition-all duration-200 text-center
                    ${selectedCup?.name === cup.name
                      ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300 active:bg-amber-100'
                    }
                    transform active:scale-95
                  `}
                >
                  <div className="font-semibold text-sm md:text-base">{cup.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {cup.addPrice > 0 ? `¥${cup.addPrice}` : '免费'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 糖度选择 */}
        {coffee.sugars && coffee.sugars.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">选择糖度</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {coffee.sugars.map((sugar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSugar(sugar)}
                  className={`
                    p-2 md:p-3 rounded-lg border transition-all duration-200 text-center
                    ${selectedSugar?.name === sugar.name
                      ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300 active:bg-amber-100'
                    }
                    transform active:scale-95
                  `}
                >
                  <div className="font-semibold text-sm md:text-base">{sugar.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {sugar.addPrice > 0 ? `¥${sugar.addPrice}` : '免费'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 温度选择 */}
        {coffee.temperatures && coffee.temperatures.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">选择温度</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {coffee.temperatures.map((temp, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTemperature(temp)}
                  className={`
                    p-2 md:p-3 rounded-lg border transition-all duration-200 text-center
                    ${selectedTemperature?.name === temp.name
                      ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300 active:bg-amber-100'
                    }
                    transform active:scale-95
                  `}
                >
                  <div className="font-semibold text-sm md:text-base">{temp.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {temp.addPrice > 0 ? `¥${temp.addPrice}` : '免费'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 数量选择 */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">选择数量</h3>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-200 transform active:scale-95"
            >
              -
            </button>
            <span className="text-xl md:text-2xl font-bold text-gray-700 w-12 md:w-16 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-200 transform active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* 价格总计和添加按钮 */}
        <div className="bg-amber-50 p-4 md:p-6 rounded-lg border border-amber-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-xl md:text-2xl font-bold text-gray-800">
              总价: ¥{calculateTotalPrice()}
            </div>
            <div className="text-xs md:text-sm text-gray-600 mt-1">
              {quantity} 杯 × ¥{calculateTotalPrice() / quantity}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={
              (coffee.cups && coffee.cups.length > 0 && !selectedCup) ||
              (coffee.sugars && coffee.sugars.length > 0 && !selectedSugar) ||
              (coffee.temperatures && coffee.temperatures.length > 0 && !selectedTemperature)
            }
            className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-3 md:py-4 px-6 rounded-lg transition-all duration-200 transform active:scale-95 disabled:active:scale-100 text-base md:text-lg shadow-md hover:shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🛒</span>
              <span>加入购物车</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function getTypeName(type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack"): string {
  const typeMap = {
    coffee: "咖啡",
    juice: "果汁", 
    tea: "茶饮",
    dessert: "甜品",
    salad: "沙拉",
    milk: "牛奶",
    snack: "小食"
  };
  return typeMap[type];
}

function getTypeStyle(type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack"): string {
  const styleMap = {
    coffee: "bg-amber-100 text-amber-800",
    juice: "bg-orange-100 text-orange-800",
    tea: "bg-green-100 text-green-800",
    dessert: "bg-pink-100 text-pink-800",
    salad: "bg-emerald-100 text-emerald-800",
    milk: "bg-blue-100 text-blue-800",
    snack: "bg-yellow-100 text-yellow-800"
  };
  return styleMap[type];
}

function getCoffeeEmoji(coffeeName: string): string {
  const emojiMap: { [key: string]: string } = {
    // 咖啡类
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
    '玫瑰拿铁': '🌹',
    // 果汁类
    '手打柠檬茶': '🍋',
    // 茶类
    '乌龙茶': '🍵',
    '茉莉花茶': '🌸',
    '红茶': '🍵',
    // 甜品类
    '提拉米苏': '🍰',
    '芝士蛋糕': '🧀',
    '巧克力布朗尼': '🍫',
    '抹茶千层': '🍃',
    '马卡龙礼盒': '🌈',
    // 沙拉类
    '凯撒沙拉': '🥗',
    '牛油果鸡胸沙拉': '🥑',
    '藜麦蔬菜沙拉': '🌱',
    '地中海风情沙拉': '🫒',
    // 牛奶类
    '燕麦牛奶': '🌾',
    '杏仁牛奶': '🌰',
    '椰奶': '🥥',
    '有机全脂牛奶': '🥛',
    // 小食类
    '牛角包': '🥐',
    '三明治': '🥪',
    '能量棒': '🍫',
    '酸奶杯': '🥛',
    '坚果混合': '🥜',
  };
  return emojiMap[coffeeName] || '🍴';
} 