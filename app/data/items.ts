import type { Item } from "../types/item";

export const items: Item[] = [
  {
    name: "美式",
    type: "coffee",
    description: "经典的黑咖啡，由浓缩咖啡加热水制成，口感纯正，苦味适中，是咖啡爱好者的首选。",
    basePrice: 10,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "超大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "拿铁",
    type: "coffee",
    description: "浓缩咖啡与蒸制牛奶的完美结合，奶香浓郁，口感丝滑，咖啡与牛奶的比例恰到好处。",
    basePrice: 15,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "卡布奇诺",
    type: "coffee",
    description: "意式经典咖啡，浓缩咖啡、蒸制牛奶和丰富奶泡的三重奏，口感层次分明，奶泡细腻。",
    basePrice: 16,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "摩卡",
    type: "coffee",
    description: "咖啡与巧克力的浪漫邂逅，浓郁的巧克力味与醇厚的咖啡香完美融合，甜蜜诱人。",
    basePrice: 18,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "焦糖玛奇朵",
    type: "coffee",
    description: "香甜的焦糖与浓郁的咖啡交织，奶泡上的焦糖纹理如艺术品般美丽，甜而不腻。",
    basePrice: 20,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 4 },
        { name: "超大杯", addPrice: 7 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "香草拿铁",
    type: "coffee",
    description: "经典拿铁加入香草糖浆，香草的甜美与咖啡的醇厚完美结合，带来温暖惬意的味觉体验。",
    basePrice: 17,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "榛果拿铁",
    type: "coffee",
    description: "浓郁的榛果香味与丝滑的拿铁结合，坚果的醇香为咖啡增添了独特的层次感和温暖口感。",
    basePrice: 17,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "抹茶拿铁",
    type: "coffee",
    description: "日式抹茶与意式拿铁的东西方完美融合，浓郁的抹茶香配上丝滑的牛奶，清香回甘。",
    basePrice: 19,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "燕麦拿铁",
    type: "coffee",
    description: "健康的燕麦奶制作的拿铁，清爽的植物奶香与咖啡完美融合，适合乳糖不耐受和素食主义者。",
    basePrice: 16,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "超大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 },
        { name: "多糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "气泡美式",
    type: "coffee",
    description: "创新的气泡咖啡，在经典美式的基础上加入气泡水，口感清爽有层次，夏日限定的特色饮品。",
    basePrice: 14,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "超大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },

  // 甜品类
  {
    name: "提拉米苏",
    type: "dessert",
    description: "经典意式甜品，浓郁的咖啡香与丝滑的马斯卡彭奶酪完美融合，层次丰富，入口即化。",
    basePrice: 28,
    options: {
    }
  },
  {
    name: "芝士蛋糕",
    type: "dessert",
    description: "浓郁的芝士香味，口感细腻顺滑，配以酥脆的饼干底，是甜品爱好者的不二选择。",
    basePrice: 25,
    options: {
    }
  },
  {
    name: "巧克力布朗尼",
    type: "dessert",
    description: "浓郁的巧克力香味，质地湿润，外酥内软，每一口都是巧克力的浓情蜜意。",
    basePrice: 22,
    options: {
    }
  },
  {
    name: "抹茶千层",
    type: "dessert",
    description: "层层叠叠的抹茶可丽饼，配以清香的抹茶奶油，口感丰富，颜值与美味并存。",
    basePrice: 32,
    options: {
    }
  },


  // 沙拉轻食类
  {
    name: "凯撒沙拉",
    type: "salad",
    description: "新鲜罗马生菜配以经典凯撒酱汁，撒上帕尔马干酪和酥脆面包丁，清爽健康。",
    basePrice: 35,
    options: {
    }
  },
  {
    name: "牛油果鸡胸沙拉",
    type: "salad",
    description: "嫩滑的牛油果配以烤制鸡胸肉，搭配混合蔬菜和坚果，营养丰富，口感层次分明。",
    basePrice: 42,
    options: {
    }
  },
  {
    name: "藜麦蔬菜沙拉",
    type: "salad",
    description: "营养丰富的藜麦配以时令蔬菜，淋上自制油醋汁，清香爽口，是健康饮食的完美选择。",
    basePrice: 38,
    options: {
    }
  },
  {
    name: "地中海风情沙拉",
    type: "salad",
    description: "橄榄、番茄、黄瓜和菲达奶酪的经典组合，淋上橄榄油和香草调料，地中海风味浓郁。",
    basePrice: 40,
    options: {
    }
  },

  // 牛奶类
  {
    name: "燕麦奶",
    type: "milk",
    description: "精选优质燕麦制作的植物奶，口感香醇，富含纤维，适合乳糖不耐受人群。",
    basePrice: 15,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "超大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "杏仁奶",
    type: "milk",
    description: "新鲜杏仁研磨制成的植物奶，口感清香，富含维生素E，是健康生活的优质选择。",
    basePrice: 16,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "超大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "椰奶",
    type: "milk",
    description: "新鲜椰肉提取的椰奶，天然香甜，口感浓郁，带有浓郁的热带风情。",
    basePrice: 18,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "超大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冰", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },

  // 烘培&三明治
  {
    name: "牛角包",
    type: "snack",
    description: "法式经典牛角包，层次分明，外酥内软，淡淡的黄油香味，是早餐的完美选择。",
    basePrice: 12,
    options: {
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "加热", addPrice: 2 }
      ]
    }
  },
  {
    name: "三明治",
    type: "snack",
    description: "新鲜面包配以火腿、生菜、番茄等丰富配料，营养均衡，是快捷美味的轻食选择。",
    basePrice: 25,
    options: {
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "加热", addPrice: 3 }
      ]
    }
  },


]; 