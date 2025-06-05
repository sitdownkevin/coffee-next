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
        { name: "特大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 7 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "浓缩咖啡",
    type: "coffee",
    description: "纯正的意式浓缩，短萃取时间造就的浓郁咖啡精华，口感强烈，适合真正的咖啡行家。",
    basePrice: 8,
    options: {
      cup: [
        { name: "小杯", addPrice: 0 },
        { name: "中杯", addPrice: 2 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "热", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "冰美式",
    type: "coffee",
    description: "清爽的冰镇版美式咖啡，保持了咖啡的纯正味道，在炎热的夏日带来清凉的咖啡体验。",
    basePrice: 12,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 },
        { name: "特大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "冷", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 },
        { name: "多冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "白咖啡",
    type: "coffee",
    description: "马来西亚特色咖啡，选用特殊烘焙工艺，口感温和香甜，奶香浓郁，适合不喜欢苦味的人群。",
    basePrice: 14,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "桂花拿铁",
    type: "coffee",
    description: "传统中式桂花与西式拿铁的创新结合，桂花的淡雅香甜为咖啡增添了独特的东方韵味。",
    basePrice: 18,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "椰香摩卡",
    type: "coffee",
    description: "热带椰香与经典摩卡的碰撞，椰子的清香与巧克力的甜蜜层层递进，仿佛置身海岛度假。",
    basePrice: 20,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 4 },
        { name: "特大杯", addPrice: 7 }
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
        { name: "冷", addPrice: 0 }
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
        { name: "特大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "冷", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "肉桂拿铁",
    type: "coffee",
    description: "温暖的肉桂香料与丝滑拿铁的完美搭配，肉桂的微辣与咖啡的醇厚交织，带来温暖的享受。",
    basePrice: 17,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "蜂蜜拿铁",
    type: "coffee",
    description: "天然蜂蜜的甘甜与拿铁的醇厚相得益彰，自然的甜味替代人工糖分，健康美味的选择。",
    basePrice: 18,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 6 }
      ],
      sugar: [
        { name: "正常蜂蜜", addPrice: 0 },
        { name: "少蜂蜜", addPrice: 0 },
        { name: "无蜂蜜", addPrice: 0 },
        { name: "多蜂蜜", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "黑糖玛奇朵",
    type: "coffee",
    description: "台湾风味的黑糖与经典玛奇朵的结合，浓郁的黑糖香甜与咖啡的苦香层次分明，视觉与味觉的双重享受。",
    basePrice: 21,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 4 },
        { name: "特大杯", addPrice: 7 }
      ],
      sugar: [
        { name: "正常黑糖", addPrice: 0 },
        { name: "少黑糖", addPrice: 0 },
        { name: "无黑糖", addPrice: 0 },
        { name: "多黑糖", addPrice: 1 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "热", addPrice: 0 },
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "柠檬气泡咖啡",
    type: "coffee",
    description: "夏日清新特调，柠檬的酸甜与咖啡的苦香碰撞出奇妙的化学反应，气泡增添口感层次，酸甜清爽。",
    basePrice: 16,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 5 }
      ],
      sugar: [
        { name: "正常糖", addPrice: 0 },
        { name: "少糖", addPrice: 0 },
        { name: "无糖", addPrice: 0 }
      ],
      temperature: [
        { name: "冷", addPrice: 0 },
        { name: "去冰", addPrice: 0 },
        { name: "少冰", addPrice: 0 }
      ]
    }
  },
  {
    name: "玫瑰拿铁",
    type: "coffee",
    description: "浪漫的玫瑰花香与经典拿铁的优雅结合，食用玫瑰花瓣的淡雅香气为咖啡增添了诗意的浪漫气息。",
    basePrice: 19,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 3 },
        { name: "特大杯", addPrice: 6 }
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
        { name: "冷", addPrice: 0 }
      ]
    }
  },
  {
    name: "手打柠檬茶",
    type: "juice",
    description: "新鲜的柠檬汁与茶底的完美融合，口感清新，酸甜适中，是夏日解渴的绝佳选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 },
        { name: "大杯", addPrice: 2 }
      ]
    }
  },
  {
    name: "乌龙茶",
    type: "tea",
    description: "清香的乌龙茶，口感醇厚，回甘悠长，是茶爱好者的经典选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 }
      ]
    }
  },
  {
    name: "茉莉花茶",
    type: "tea",
    description: "清香的茉莉花茶，口感清新，回甘悠长，是茶爱好者的经典选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 }
      ]
    }
  },
  {
    name: "红茶",
    type: "tea",
    description: "醇厚的红茶，口感浓郁，回甘悠长，是茶爱好者的经典选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "中杯", addPrice: 0 }
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
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 5 }
      ],
      temperature: [
        { name: "冷藏", addPrice: 0 },
        { name: "常温", addPrice: 0 }
      ]
    }
  },
  {
    name: "芝士蛋糕",
    type: "dessert",
    description: "浓郁的芝士香味，口感细腻顺滑，配以酥脆的饼干底，是甜品爱好者的不二选择。",
    basePrice: 25,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 5 }
      ],
      temperature: [
        { name: "冷藏", addPrice: 0 }
      ]
    }
  },
  {
    name: "巧克力布朗尼",
    type: "dessert",
    description: "浓郁的巧克力香味，质地湿润，外酥内软，每一口都是巧克力的浓情蜜意。",
    basePrice: 22,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 4 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "加热", addPrice: 2 }
      ]
    }
  },
  {
    name: "抹茶千层",
    type: "dessert",
    description: "层层叠叠的抹茶可丽饼，配以清香的抹茶奶油，口感丰富，颜值与美味并存。",
    basePrice: 32,
    options: {
      cup: [
        { name: "标准", addPrice: 0 }
      ],
      temperature: [
        { name: "冷藏", addPrice: 0 }
      ]
    }
  },
  {
    name: "马卡龙礼盒",
    type: "dessert",
    description: "法式经典马卡龙，多种口味组合，外壳酥脆，内馅香甜，是送礼和自享的完美选择。",
    basePrice: 45,
    options: {
      cup: [
        { name: "6枚装", addPrice: 0 },
        { name: "12枚装", addPrice: 20 }
      ]
    }
  },

  // 沙拉类
  {
    name: "凯撒沙拉",
    type: "salad",
    description: "新鲜罗马生菜配以经典凯撒酱汁，撒上帕尔马干酪和酥脆面包丁，清爽健康。",
    basePrice: 35,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 8 }
      ],
      temperature: [
        { name: "冷食", addPrice: 0 }
      ]
    }
  },
  {
    name: "牛油果鸡胸沙拉",
    type: "salad",
    description: "嫩滑的牛油果配以烤制鸡胸肉，搭配混合蔬菜和坚果，营养丰富，口感层次分明。",
    basePrice: 42,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 10 }
      ],
      temperature: [
        { name: "冷食", addPrice: 0 }
      ]
    }
  },
  {
    name: "藜麦蔬菜沙拉",
    type: "salad",
    description: "营养丰富的藜麦配以时令蔬菜，淋上自制油醋汁，清香爽口，是健康饮食的完美选择。",
    basePrice: 38,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 8 }
      ],
      temperature: [
        { name: "冷食", addPrice: 0 }
      ]
    }
  },
  {
    name: "地中海风情沙拉",
    type: "salad",
    description: "橄榄、番茄、黄瓜和菲达奶酪的经典组合，淋上橄榄油和香草调料，地中海风味浓郁。",
    basePrice: 40,
    options: {
      cup: [
        { name: "小份", addPrice: 0 },
        { name: "大份", addPrice: 9 }
      ],
      temperature: [
        { name: "冷食", addPrice: 0 }
      ]
    }
  },

  // 牛奶类
  {
    name: "燕麦牛奶",
    type: "milk",
    description: "精选优质燕麦制作的植物奶，口感香醇，富含纤维，适合乳糖不耐受人群。",
    basePrice: 15,
    options: {
      cup: [
        { name: "小杯", addPrice: 0 },
        { name: "中杯", addPrice: 2 },
        { name: "大杯", addPrice: 4 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "冷藏", addPrice: 0 },
        { name: "加热", addPrice: 1 }
      ]
    }
  },
  {
    name: "杏仁牛奶",
    type: "milk",
    description: "新鲜杏仁研磨制成的植物奶，口感清香，富含维生素E，是健康生活的优质选择。",
    basePrice: 16,
    options: {
      cup: [
        { name: "小杯", addPrice: 0 },
        { name: "中杯", addPrice: 2 },
        { name: "大杯", addPrice: 4 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "冷藏", addPrice: 0 }
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
        { name: "小杯", addPrice: 0 },
        { name: "中杯", addPrice: 3 },
        { name: "大杯", addPrice: 5 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "冷藏", addPrice: 0 }
      ]
    }
  },
  {
    name: "有机全脂牛奶",
    type: "milk",
    description: "来自有机牧场的新鲜全脂牛奶，口感醇厚，营养丰富，是经典的健康选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "小杯", addPrice: 0 },
        { name: "中杯", addPrice: 2 },
        { name: "大杯", addPrice: 3 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "冷藏", addPrice: 0 },
        { name: "加热", addPrice: 1 }
      ]
    }
  },

  // 小食类
  {
    name: "牛角包",
    type: "snack",
    description: "法式经典牛角包，层次分明，外酥内软，淡淡的黄油香味，是早餐的完美选择。",
    basePrice: 12,
    options: {
      cup: [
        { name: "单个", addPrice: 0 },
        { name: "两个装", addPrice: 8 }
      ],
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
      cup: [
        { name: "标准", addPrice: 0 },
        { name: "加量", addPrice: 5 }
      ],
      temperature: [
        { name: "常温", addPrice: 0 },
        { name: "加热", addPrice: 3 }
      ]
    }
  },
  {
    name: "能量棒",
    type: "snack",
    description: "燕麦、坚果和干果制成的营养能量棒，富含蛋白质和纤维，是健身和办公的理想零食。",
    basePrice: 18,
    options: {
      cup: [
        { name: "单条", addPrice: 0 },
        { name: "三条装", addPrice: 12 }
      ]
    }
  },
  {
    name: "酸奶杯",
    type: "snack",
    description: "新鲜酸奶配以水果颗粒和燕麦脆片，酸甜可口，富含益生菌，有益肠道健康。",
    basePrice: 16,
    options: {
      cup: [
        { name: "小杯", addPrice: 0 },
        { name: "大杯", addPrice: 4 }
      ],
      temperature: [
        { name: "冷藏", addPrice: 0 }
      ]
    }
  },
  {
    name: "坚果混合",
    type: "snack",
    description: "精选多种坚果混合，包含杏仁、核桃、腰果等，营养丰富，是健康的零食选择。",
    basePrice: 22,
    options: {
      cup: [
        { name: "小包", addPrice: 0 },
        { name: "大包", addPrice: 8 }
      ]
    }
  }
]; 