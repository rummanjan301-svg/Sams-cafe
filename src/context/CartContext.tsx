import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menuData';
import { OrderType } from '../types/order';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CustomerCheckoutForm {
  name: string;
  phone: string;
  orderType: OrderType; // Strictly 'pickup' | 'delivery'
  deliveryAddress: string;
  deliveryLandmark: string;
  specialInstructions: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalQuantity: number; // Total count of items (1 pizza + 2 burgers = 3)
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  customerForm: CustomerCheckoutForm;
  setCustomerForm: React.Dispatch<React.SetStateAction<CustomerCheckoutForm>>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sams_cafe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [customerForm, setCustomerForm] = useState<CustomerCheckoutForm>({
    name: '',
    phone: '',
    orderType: 'pickup', // Default to pickup
    deliveryAddress: '',
    deliveryLandmark: '',
    specialInstructions: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('sams_cafe_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items]);

  // Subtle auto-dismiss toast
  const clearToast = () => setToastMessage(null);

  // STRICT REQUIREMENT: Add to cart MUST NOT open the cart drawer or redirect
  const addToCart = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });

    // DO NOT OPEN CART DRAWER. Show subtle confirmation toast instead:
    setToastMessage(`Added "${item.name}" to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Total quantity of all products combined (e.g. 1 pizza + 2 burgers = 3)
  const totalQuantity = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const deliveryFee = customerForm.orderType === 'delivery' && items.length > 0 ? 100 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalQuantity,
        subtotal,
        deliveryFee,
        grandTotal,
        customerForm,
        setCustomerForm,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        toastMessage,
        clearToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
