import type { Coffee, CoffeeOption } from './coffee';

export interface CartItem {
  id: string;
  coffee: Coffee;
  selectedCup: CoffeeOption;
  selectedSugar: CoffeeOption;
  selectedTemperature: CoffeeOption;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
} 