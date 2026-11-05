import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalQuantity,
    subtotal,
    setIsCheckoutModalOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#121212] border-l border-[#242424] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#202020] bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#202020] text-[#FFC928]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#F5F2EA] leading-none">
                Your Cart
              </h2>
              <span className="text-xs text-[#A6A6A6]">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in order
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[#A6A6A6] hover:text-[#D62828] transition-colors px-2 py-1 cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-2 rounded-xl bg-[#202020] hover:bg-[#2A2A2A] text-[#A6A6A6] hover:text-[#F5F2EA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#2B2B2B] text-[#737373] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-[#F5F2EA]">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#A6A6A6] max-w-xs mx-auto">
                  Explore our artisan pizzas, loaded smash burgers, and crispy wings.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((ci) => (
                <div
                  key={ci.item.id}
                  className="p-3.5 rounded-xl bg-[#161616] border border-[#242424] flex items-center gap-3.5"
                >
                  <img
                    src={ci.item.image}
                    alt={ci.item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#202020]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-sm text-[#F5F2EA] truncate">
                      {ci.item.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#FFC928] tabular-nums">
                      PKR {ci.item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity stepper controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg bg-[#202020] border border-[#2D2D2D]">
                      <button
                        onClick={() => updateQuantity(ci.item.id, -1)}
                        aria-label={`Decrease quantity of ${ci.item.name}`}
                        className="p-1.5 text-[#A6A6A6] hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums text-[#F5F2EA]">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.item.id, 1)}
                        aria-label={`Increase quantity of ${ci.item.name}`}
                        className="p-1.5 text-[#A6A6A6] hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(ci.item.id)}
                      aria-label={`Remove ${ci.item.name}`}
                      className="p-1.5 text-[#737373] hover:text-[#D62828] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#202020] bg-[#161616] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A6A6A6]">Subtotal ({totalQuantity} items)</span>
              <span className="font-display font-bold text-lg text-[#FFC928] tabular-nums">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full py-4 px-5 rounded-xl bg-[#FFC928] hover:bg-[#E5A900] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFC928]/15 active:scale-98 transition-all cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 text-xs text-[#A6A6A6] hover:text-[#F5F2EA] transition-colors text-center cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
