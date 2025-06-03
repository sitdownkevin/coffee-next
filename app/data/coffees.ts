import type { Coffee } from "../types/coffee";

export const coffees: Coffee[] = [
  {
    name: "美式",
    description: "经典的黑咖啡，由浓缩咖啡加热水制成，口感纯正，苦味适中，是咖啡爱好者的首选。",
    basePrice: 10,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 2 },
      { name: "特大杯", addPrice: 5 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "拿铁",
    description: "浓缩咖啡与蒸制牛奶的完美结合，奶香浓郁，口感丝滑，咖啡与牛奶的比例恰到好处。",
    basePrice: 15,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "卡布奇诺",
    description: "意式经典咖啡，浓缩咖啡、蒸制牛奶和丰富奶泡的三重奏，口感层次分明，奶泡细腻。",
    basePrice: 16,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "摩卡",
    description: "咖啡与巧克力的浪漫邂逅，浓郁的巧克力味与醇厚的咖啡香完美融合，甜蜜诱人。",
    basePrice: 18,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "焦糖玛奇朵",
    description: "香甜的焦糖与浓郁的咖啡交织，奶泡上的焦糖纹理如艺术品般美丽，甜而不腻。",
    basePrice: 20,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 4 },
      { name: "特大杯", addPrice: 7 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "浓缩咖啡",
    description: "纯正的意式浓缩，短萃取时间造就的浓郁咖啡精华，口感强烈，适合真正的咖啡行家。",
    basePrice: 8,
    cups: [
      { name: "小杯", addPrice: 0 },
      { name: "中杯", addPrice: 2 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "热", addPrice: 0 }
    ]
  },
  {
    name: "香草拿铁",
    description: "经典拿铁加入香草糖浆，香草的甜美与咖啡的醇厚完美结合，带来温暖惬意的味觉体验。",
    basePrice: 17,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "榛果拿铁",
    description: "浓郁的榛果香味与丝滑的拿铁结合，坚果的醇香为咖啡增添了独特的层次感和温暖口感。",
    basePrice: 17,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "冰美式",
    description: "清爽的冰镇版美式咖啡，保持了咖啡的纯正味道，在炎热的夏日带来清凉的咖啡体验。",
    basePrice: 12,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 2 },
      { name: "特大杯", addPrice: 5 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "冷", addPrice: 0 },
      { name: "去冰", addPrice: 0 },
      { name: "少冰", addPrice: 0 },
      { name: "多冰", addPrice: 0 }
    ]
  },
  {
    name: "白咖啡",
    description: "马来西亚特色咖啡，选用特殊烘焙工艺，口感温和香甜，奶香浓郁，适合不喜欢苦味的人群。",
    basePrice: 14,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "抹茶拿铁",
    description: "日式抹茶与意式拿铁的东西方完美融合，浓郁的抹茶香配上丝滑的牛奶，清香回甘。",
    basePrice: 19,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "桂花拿铁",
    description: "传统中式桂花与西式拿铁的创新结合，桂花的淡雅香甜为咖啡增添了独特的东方韵味。",
    basePrice: 18,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "燕麦拿铁",
    description: "健康的燕麦奶制作的拿铁，清爽的植物奶香与咖啡完美融合，适合乳糖不耐受和素食主义者。",
    basePrice: 16,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "椰香摩卡",
    description: "热带椰香与经典摩卡的碰撞，椰子的清香与巧克力的甜蜜层层递进，仿佛置身海岛度假。",
    basePrice: 20,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 4 },
      { name: "特大杯", addPrice: 7 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "气泡美式",
    description: "创新的气泡咖啡，在经典美式的基础上加入气泡水，口感清爽有层次，夏日限定的特色饮品。",
    basePrice: 14,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 2 },
      { name: "特大杯", addPrice: 5 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "冷", addPrice: 0 },
      { name: "去冰", addPrice: 0 },
      { name: "少冰", addPrice: 0 }
    ]
  },
  {
    name: "肉桂拿铁",
    description: "温暖的肉桂香料与丝滑拿铁的完美搭配，肉桂的微辣与咖啡的醇厚交织，带来温暖的享受。",
    basePrice: 17,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "蜂蜜拿铁",
    description: "天然蜂蜜的甘甜与拿铁的醇厚相得益彰，自然的甜味替代人工糖分，健康美味的选择。",
    basePrice: 18,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常蜂蜜", addPrice: 0 },
      { name: "少蜂蜜", addPrice: 0 },
      { name: "无蜂蜜", addPrice: 0 },
      { name: "多蜂蜜", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "黑糖玛奇朵",
    description: "台湾风味的黑糖与经典玛奇朵的结合，浓郁的黑糖香甜与咖啡的苦香层次分明，视觉与味觉的双重享受。",
    basePrice: 21,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 4 },
      { name: "特大杯", addPrice: 7 }
    ],
    sugars: [
      { name: "正常黑糖", addPrice: 0 },
      { name: "少黑糖", addPrice: 0 },
      { name: "无黑糖", addPrice: 0 },
      { name: "多黑糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  },
  {
    name: "柠檬气泡咖啡",
    description: "夏日清新特调，柠檬的酸甜与咖啡的苦香碰撞出奇妙的化学反应，气泡增添口感层次，酸甜清爽。",
    basePrice: 16,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 5 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 }
    ],
    temperatures: [
      { name: "冷", addPrice: 0 },
      { name: "去冰", addPrice: 0 },
      { name: "少冰", addPrice: 0 }
    ]
  },
  {
    name: "玫瑰拿铁",
    description: "浪漫的玫瑰花香与经典拿铁的优雅结合，食用玫瑰花瓣的淡雅香气为咖啡增添了诗意的浪漫气息。",
    basePrice: 19,
    cups: [
      { name: "中杯", addPrice: 0 },
      { name: "大杯", addPrice: 3 },
      { name: "特大杯", addPrice: 6 }
    ],
    sugars: [
      { name: "正常糖", addPrice: 0 },
      { name: "少糖", addPrice: 0 },
      { name: "无糖", addPrice: 0 },
      { name: "多糖", addPrice: 1 }
    ],
    temperatures: [
      { name: "常温", addPrice: 0 },
      { name: "热", addPrice: 0 },
      { name: "冷", addPrice: 0 }
    ]
  }
]; 