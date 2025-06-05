import type { Item, ItemInCart } from "../types/item";
import { useState, useEffect, useRef } from "react";

interface CoffeeListProps {
  items: Item[];
  itemSelected: Item | null;
  handleSelect: (item: Item) => void;
}

function LabelItem({ type, id }: { type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack", id: string }) {
  const labelMap = {
    coffee: "咖啡",
    juice: "果汁", 
    tea: "茶",
    dessert: "甜品",
    salad: "沙拉",
    milk: "牛奶",
    snack: "小食",
  }
  
  return (
    <div id={id} className="scroll-mt-4">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 p-4 bg-gray-50">{labelMap[type]}</h3>
    </div>
  )
}

function ItemCard({
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

export default function ItemList({
  items,
  itemSelected,
  handleSelect,
}: CoffeeListProps) {

  const dataCoffee = items.filter(item => item.type === "coffee")
  const dataJuice = items.filter(item => item.type === "juice")
  const dataTea = items.filter(item => item.type === "tea")
  const dataDessert = items.filter(item => item.type === "dessert")
  const dataSalad = items.filter(item => item.type === "salad")
  const dataMilk = items.filter(item => item.type === "milk")
  const dataSnack = items.filter(item => item.type === "snack")

  const [activeSection, setActiveSection] = useState("coffee-section");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: "coffee-section", label: "咖啡", type: "coffee" as const },
    { id: "juice-section", label: "果汁", type: "juice" as const },
    { id: "tea-section", label: "茶", type: "tea" as const },
    { id: "dessert-section", label: "甜品", type: "dessert" as const },
    { id: "salad-section", label: "沙拉", type: "salad" as const },
    { id: "milk-section", label: "牛奶", type: "milk" as const },
    { id: "snack-section", label: "小食", type: "snack" as const },
  ];

  const scrollToSection = (sectionId: string) => {
    const scrollContainer = scrollContainerRef.current;
    const element = document.getElementById(sectionId);
    
    if (element && scrollContainer) {
      const elementTop = element.offsetTop;
      
      // 使用 requestAnimationFrame 确保在移动端平滑滚动
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: elementTop - 10,
          behavior: 'smooth'
        });
      });
      
      setActiveSection(sectionId);
    }
  };

  // 监听滚动事件来更新激活状态
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const sections = ['coffee-section', 'juice-section', 'tea-section', 'dessert-section', 'salad-section', 'milk-section', 'snack-section'];
      const scrollTop = scrollContainer.scrollTop;

      // 找到当前可视区域的 section
      let currentSection = 'coffee-section';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollTop >= elementTop - 100) {
            currentSection = sectionId;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="h-full bg-white md:border-r border-gray-200 overflow-hidden flex touch-pan-y">
      {/* 左侧导航目录 */}
      <div className="hidden md:block w-20 lg:w-24 bg-gray-100 flex-shrink-0 overflow-y-auto touch-scroll">
        <div className="py-1">
          {navItems.map((item) => {
            const hasItems = item.type === "coffee" ? dataCoffee.length > 0 : 
                             item.type === "juice" ? dataJuice.length > 0 : 
                             item.type === "tea" ? dataTea.length > 0 :
                             item.type === "dessert" ? dataDessert.length > 0 :
                             item.type === "salad" ? dataSalad.length > 0 :
                             item.type === "milk" ? dataMilk.length > 0 :
                             dataSnack.length > 0;
            
            if (!hasItems) return null;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onTouchStart={() => {}} // 确保触摸事件在移动端正常工作
                className={`w-full text-center py-3 px-1 text-xs font-medium transition-all duration-200 touch-button border-b border-gray-200 ${
                  activeSection === item.id
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-sm">{getTypeEmoji(item.type)}</span>
                  <span className="text-xs leading-tight">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-white touch-scroll"
      >
        {/* 咖啡分类 */}
        {dataCoffee.length > 0 && (
          <>
            <LabelItem type="coffee" id="coffee-section"/>
            <div className="px-2 pb-4">
              {dataCoffee.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 果汁分类 */}
        {dataJuice.length > 0 && (
          <>
            <LabelItem type="juice" id="juice-section"/>
            <div className="px-2 pb-4">
              {dataJuice.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 茶分类 */}
        {dataTea.length > 0 && (
          <>
            <LabelItem type="tea" id="tea-section"/>
            <div className="px-2 pb-4">
              {dataTea.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 甜品分类 */}
        {dataDessert.length > 0 && (
          <>
            <LabelItem type="dessert" id="dessert-section"/>
            <div className="px-2 pb-4">
              {dataDessert.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 沙拉分类 */}
        {dataSalad.length > 0 && (
          <>
            <LabelItem type="salad" id="salad-section"/>
            <div className="px-2 pb-4">
              {dataSalad.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 牛奶分类 */}
        {dataMilk.length > 0 && (
          <>
            <LabelItem type="milk" id="milk-section"/>
            <div className="px-2 pb-4">
              {dataMilk.map((item, index) => (
                <ItemCard 
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 小食分类 */}
        {dataSnack.length > 0 && (
          <>
            <LabelItem type="snack" id="snack-section"/>
            <div className="px-2 pb-4">
              {dataSnack.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  itemSelected={itemSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}

        {/* 底部安全区域 */}
        <div className="h-20 md:h-4"></div>
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

function getTypeEmoji(type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack"): string {
  const typeEmojiMap = {
    coffee: "☕",
    juice: "🧃",
    tea: "🍵",
    dessert: "🍰",
    salad: "🥗",
    milk: "🥛",
    snack: "🥐"
  };
  return typeEmojiMap[type];
}
