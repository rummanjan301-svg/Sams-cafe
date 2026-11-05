import React from 'react';
import { ShoppingBag, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileQuickBar: React.FC = () => {
  const { totalQuantity, subtotal, setIsCartOpen } = useCart();

  const handleScrollToMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      const navHeight = 76;
      const elementPosition = menuEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-30 pointer-events-auto">
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-3">
        {/* Menu button */}
        <a
          href="#menu"
          onClick={handleScrollToMenu}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1C1C1C] text-[#F5F2EA] hover:text-[#FFC928] text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Utensils className="w-3.5 h-3.5 text-[#FFC928]" />
          <span>Menu</span>
        </a>

        {/* Cart button with yellow total quantity badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] text-xs font-display font-bold uppercase tracking-wider shadow-lg shadow-[#FFC928]/15 active:scale-95 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalQuantity > 0 && (
              <span className="w-4 h-4 bg-[#D62828] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
          {totalQuantity > 0 && (
            <span className="tabular-nums font-extrabold text-[11px]">
              PKR {subtotal.toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
