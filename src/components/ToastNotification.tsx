import React from 'react';
import { Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage, clearToast, setIsCartOpen, totalQuantity } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#181818] border border-[#2B2B2B] text-[#F5F2EA] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
        <div className="w-7 h-7 rounded-full bg-[#FFC928] text-[#0B0B0B] flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#F5F2EA] truncate">{toastMessage}</p>
          <p className="text-[10px] text-[#A6A6A6]">Cart total: {totalQuantity} items</p>
        </div>
        <button
          onClick={() => {
            clearToast();
            setIsCartOpen(true);
          }}
          className="text-xs font-bold text-[#FFC928] hover:underline px-1 whitespace-nowrap cursor-pointer"
        >
          View Cart
        </button>
        <button
          onClick={clearToast}
          aria-label="Dismiss notification"
          className="text-[#737373] hover:text-[#F5F2EA] p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
