export interface CoffeeOption {
  name: string;
  name_short?: string;
  addPrice: number;
}

export interface Coffee {
  name: string;
  description: string;
  basePrice: number;
  cups: CoffeeOption[];
  sugars: CoffeeOption[];
  temperatures: CoffeeOption[];
}

export interface OrderItem {
  coffee: Coffee;
  selectedCup: CoffeeOption;
  selectedSugar: CoffeeOption;
  selectedTemperature: CoffeeOption;
  quantity: number;
  totalPrice: number;
} 