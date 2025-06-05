// 商品某个属性的选项
export interface ItemOption {
  name: string;
  name_short?: string;
  addPrice: number;
}


// 商品
export interface Item {
  name: string;
  description: string;
  type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack";
  basePrice: number;  // 基础价格
  options?: {
    cup?: ItemOption[];
    sugar?: ItemOption[];
    temperature?: ItemOption[];
  }
}


// 购物车中的商品
export interface ItemInCart extends Item {
  hash: string; // hash of the item and optionsSelected
  optionsSelected?: {
    cup?: ItemOption;
    sugar?: ItemOption;
    temperature?: ItemOption;
  }
  quantity: number;
}