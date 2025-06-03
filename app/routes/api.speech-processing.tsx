import { type ActionFunctionArgs } from "react-router";

// 假的咖啡数据
const COFFEE_MENU = [
  {
    id: 1,
    name: "美式咖啡",
    price: 25,
    size: "中杯",
    temperature: "热饮",
    description: "经典美式咖啡，醇香浓郁"
  },
  {
    id: 2,
    name: "拿铁咖啡",
    price: 32,
    size: "大杯",
    temperature: "热饮",
    description: "香滑拿铁，奶香浓郁"
  },
  {
    id: 3,
    name: "卡布奇诺",
    price: 28,
    size: "中杯",
    temperature: "热饮",
    description: "意式卡布奇诺，奶泡丰富"
  },
  {
    id: 4,
    name: "摩卡咖啡",
    price: 35,
    size: "大杯",
    temperature: "热饮",
    description: "巧克力摩卡，甜香醇厚"
  },
  {
    id: 5,
    name: "冰美式",
    price: 25,
    size: "大杯",
    temperature: "冰饮",
    description: "清爽冰美式，夏日首选"
  }
];

// 检测是否为点单意图
function detectOrderIntent(text: string) {
  const orderKeywords = [
    '点', '要', '来', '买', '购买', '下单', '订购',
    '咖啡', '拿铁', '美式', '卡布奇诺', '摩卡',
    '一杯', '两杯', '三杯', '热的', '冰的', '大杯', '中杯', '小杯'
  ];
  
  const lowerText = text.toLowerCase();
  return orderKeywords.some(keyword => lowerText.includes(keyword));
}

// 根据语音文本匹配咖啡
function matchCoffeeFromText(text: string) {
  const matchedCoffees = [];
  const lowerText = text.toLowerCase();
  
  // 匹配咖啡类型
  if (lowerText.includes('美式') || lowerText.includes('americano')) {
    if (lowerText.includes('冰') || lowerText.includes('cold')) {
      const coffee = COFFEE_MENU.find(c => c.id === 5);
      if (coffee) matchedCoffees.push(coffee);
    } else {
      const coffee = COFFEE_MENU.find(c => c.id === 1);
      if (coffee) matchedCoffees.push(coffee);
    }
  }
  
  if (lowerText.includes('拿铁') || lowerText.includes('latte')) {
    const coffee = COFFEE_MENU.find(c => c.id === 2);
    if (coffee) matchedCoffees.push(coffee);
  }
  
  if (lowerText.includes('卡布奇诺') || lowerText.includes('cappuccino')) {
    const coffee = COFFEE_MENU.find(c => c.id === 3);
    if (coffee) matchedCoffees.push(coffee);
  }
  
  if (lowerText.includes('摩卡') || lowerText.includes('mocha')) {
    const coffee = COFFEE_MENU.find(c => c.id === 4);
    if (coffee) matchedCoffees.push(coffee);
  }
  
  // 如果没有匹配到具体咖啡，默认推荐美式
  if (matchedCoffees.length === 0 && detectOrderIntent(text)) {
    const coffee = COFFEE_MENU.find(c => c.id === 1);
    if (coffee) matchedCoffees.push(coffee);
  }
  
  return matchedCoffees;
}

// 解析数量
function parseQuantity(text: string) {
  const quantityMap = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '两': 2, '俩': 2
  };
  
  for (const [key, value] of Object.entries(quantityMap)) {
    if (text.includes(key)) {
      return value;
    }
  }
  
  return 1; // 默认数量为1
}

export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { text, timestamp, browser } = body;

    // 验证输入
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: '无效的语音文本' }), { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log('收到语音识别结果:', {
      text,
      timestamp,
      browser: browser || 'unknown',
      length: text.length
    });

    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 检测是否为点单意图
    const isOrder = detectOrderIntent(text);
    
    if (isOrder) {
      // 匹配咖啡
      const matchedCoffees = matchCoffeeFromText(text);
      const quantity = parseQuantity(text);
      
      if (matchedCoffees.length > 0) {
        // 构建购物车项目
        const cartItems = matchedCoffees.map(coffee => ({
          ...coffee,
          quantity,
          totalPrice: coffee.price * quantity,
          addedAt: new Date().toISOString()
        }));
        
        const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return new Response(JSON.stringify({
          success: true,
          isOrder: true,
          response: `好的！我为您添加了 ${cartItems.map(item => `${item.quantity}杯${item.name}`).join('、')} 到购物车。总计 ${totalAmount} 元。请确认是否下单？`,
          originalText: text,
          orderInfo: {
            items: cartItems,
            totalAmount,
            totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
          },
          actions: {
            openCart: true,
            showConfirmDialog: true
          },
          browser: browser || 'unknown',
          processedAt: new Date().toISOString()
        }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // 检测到点单意图但没有匹配到具体咖啡
        return new Response(JSON.stringify({
          success: true,
          isOrder: true,
          response: `我听到您想要点咖啡，但没有识别到具体的咖啡类型。我们有美式咖啡、拿铁、卡布奇诺、摩卡等，请告诉我您想要哪一种？`,
          originalText: text,
          suggestions: COFFEE_MENU.slice(0, 4).map(coffee => ({
            name: coffee.name,
            price: coffee.price,
            description: coffee.description
          })),
          browser: browser || 'unknown',
          processedAt: new Date().toISOString()
        }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    // 非点单的其他语音处理逻辑
    let response = '';
    const lowerText = text.toLowerCase();

    if (lowerText.includes('你好') || lowerText.includes('hello')) {
      response = '你好！欢迎来到咖啡厅！您可以语音点咖啡，比如说"我要一杯拿铁"。有什么可以帮助您的吗？';
    } else if (lowerText.includes('时间') || lowerText.includes('几点')) {
      const now = new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      response = `现在的时间是：${now}`;
    } else if (lowerText.includes('菜单') || lowerText.includes('menu')) {
      response = '我们的咖啡菜单包括：美式咖啡(25元)、拿铁咖啡(32元)、卡布奇诺(28元)、摩卡咖啡(35元)、冰美式(25元)。您想要哪一种？';
    } else if (lowerText.includes('帮助') || lowerText.includes('help')) {
      response = '我可以帮您语音点咖啡！只需说出您想要的咖啡，比如"我要一杯热拿铁"或"来两杯美式咖啡"。也可以询问菜单、时间等信息。';
    } else {
      response = `我收到了您的语音：「${text}」。如果您想点咖啡，请直接说出咖啡名称，比如"我要一杯拿铁"。`;
    }

    return new Response(JSON.stringify({
      success: true,
      isOrder: false,
      response,
      originalText: text,
      browser: browser || 'unknown',
      processedAt: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error('处理语音请求时出错:', error);
    return new Response(JSON.stringify({ 
      error: '服务器内部错误',
      message: '处理语音请求时出现问题，请稍后重试'
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 