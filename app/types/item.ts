// 商品某个属性的选项
export interface ItemOption {
  name: string;
  name_short?: string;
  addPrice: number;
}

export enum ItemType {
  Coffee = "coffee",
  Juice = "juice",
  Tea = "tea",
  Dessert = "dessert",
  Salad = "salad",
  Milk = "milk",
  Snack = "snack",
}


// 商品
export interface Item {
  name: string;
  description: string;
  type: ItemType;
  basePrice: number;  // 基础价格
  options: {
    cup?: ItemOption[];
    sugar?: ItemOption[];
    temperature?: ItemOption[];
  }
}


// 购物车中的商品
export interface ItemInCart extends Item {
  hash: string; // hash of the item and optionsSelected
  optionsSelected: {
    cup?: ItemOption;
    sugar?: ItemOption;
    temperature?: ItemOption;
  }
  quantity: number;
}