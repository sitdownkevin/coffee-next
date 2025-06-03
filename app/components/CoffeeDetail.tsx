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
      setSelectedCup(coffee.cups[0] || null);
      setSelectedSugar(coffee.sugars[0] || null);
      setSelectedTemperature(coffee.temperatures[0] || null);
      setQuantity(1);
    }
  }, [coffee]);

  if (!coffee) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">☕</div>
          <h3 className="text-xl font-semibold mb-2">请选择一款咖啡</h3>
          <p>从左侧菜单中选择您喜欢的咖啡</p>
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
    if (selectedCup && selectedSugar && selectedTemperature && onAddToCart) {
      onAddToCart({
        coffee,
        selectedCup,
        selectedSugar,
        selectedTemperature,
        quantity,
        totalPrice: calculateTotalPrice()
      });
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="p-6">
        {/* 咖啡标题 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {getCoffeeEmoji(coffee.name)}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{coffee.name}</h2>
          <p className="text-2xl text-amber-600 font-bold">基础价格: ¥{coffee.basePrice}</p>
        </div>

        {/* 规格选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">选择规格</h3>
          <div className="grid grid-cols-3 gap-3">
            {coffee.cups.map((cup, index) => (
              <button
                key={index}
                onClick={() => setSelectedCup(cup)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 text-center
                  ${selectedCup?.name === cup.name
                    ? 'bg-amber-100 border-amber-400 text-amber-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
                  }
                `}
              >
                <div className="font-semibold">{cup.name}</div>
                <div className="text-sm text-gray-600">
                  {cup.addPrice > 0 ? `+¥${cup.addPrice}` : '无加价'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 糖度选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">选择糖度</h3>
          <div className="grid grid-cols-4 gap-3">
            {coffee.sugars.map((sugar, index) => (
              <button
                key={index}
                onClick={() => setSelectedSugar(sugar)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 text-center
                  ${selectedSugar?.name === sugar.name
                    ? 'bg-amber-100 border-amber-400 text-amber-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
                  }
                `}
              >
                <div className="font-semibold">{sugar.name}</div>
                <div className="text-sm text-gray-600">
                  {sugar.addPrice > 0 ? `+¥${sugar.addPrice}` : '无加价'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 温度选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">选择温度</h3>
          <div className="grid grid-cols-4 gap-3">
            {coffee.temperatures.map((temp, index) => (
              <button
                key={index}
                onClick={() => setSelectedTemperature(temp)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 text-center
                  ${selectedTemperature?.name === temp.name
                    ? 'bg-amber-100 border-amber-400 text-amber-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
                  }
                `}
              >
                <div className="font-semibold">{temp.name}</div>
                <div className="text-sm text-gray-600">
                  {temp.addPrice > 0 ? `+¥${temp.addPrice}` : '无加价'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 数量选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">选择数量</h3>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="text-2xl font-bold text-gray-700 w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* 价格总计和添加按钮 */}
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-800">
              总价: ¥{calculateTotalPrice()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {quantity} 杯 × ¥{calculateTotalPrice() / quantity}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!selectedCup || !selectedSugar || !selectedTemperature}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            加入购物车
          </button>
        </div>
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