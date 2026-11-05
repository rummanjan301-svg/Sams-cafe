import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Info, Filter } from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart, items: cartItems } = useCart();

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="menu" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-28 bg-[#121212] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#262626]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
              FULL SELECTION
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA]">
            EXPLORE THE MENU
          </h2>
          <p className="text-sm sm:text-base text-[#A6A6A6]">
            Something delicious is waiting. Fresh pizzas, loaded burgers, wings, and coffee.
          </p>

          {/* Centralized Demo Notice */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 p-3 text-left rounded-xl bg-[#181818] border border-[#262626] text-xs text-[#A6A6A6]">
              <Info className="w-4 h-4 text-[#FFC928] shrink-0" />
              <span>
                Demonstration menu data: Centralized in <code className="text-[#FFC928] text-[11px]">menuData.ts</code> for seamless cafe updates.
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Category Buttons & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          
          {/* Category Tabs */}
          <div className="w-full lg:w-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFC928] text-[#0B0B0B] shadow-lg shadow-[#FFC928]/15'
                      : 'bg-[#181818] hover:bg-[#202020] text-[#A6A6A6] hover:text-[#F5F2EA] border border-[#242424]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes or drinks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181818] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#737373] focus:border-[#FFC928] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A6A6A6] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => {
              const inCart = cartItems.find((ci) => ci.item.id === item.id);
              return (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-2xl bg-[#161616] border border-[#242424] hover:border-[#FFC928]/40 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#FFC928]/5"
                >
                  {/* Item Image with Fallback */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1C1C1C]">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-80" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#0B0B0B]/85 border border-[#282828] text-[10px] font-bold uppercase tracking-wider text-[#F5F2EA] font-display">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FFC928] text-[#0B0B0B] text-[10px] font-black uppercase tracking-wider font-display shadow-sm">
                          Popular
                        </span>
                      )}
                      {item.isNew && (
                        <span className="px-2 py-0.5 rounded-md bg-[#D62828] text-white text-[10px] font-black uppercase tracking-wider font-display shadow-sm">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-base text-[#F5F2EA] group-hover:text-[#FFC928] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#A6A6A6] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 border-t border-[#202020] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-[#737373] tracking-wider font-semibold">Price</span>
                        <span className="text-base font-bold font-display text-[#FFC928] tabular-nums">
                          PKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        aria-label={`Add ${item.name} to order`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          inCart
                            ? 'bg-[#182B18] text-[#4ADE80] border border-[#225522]'
                            : 'bg-[#1E1E1E] hover:bg-[#FFC928] text-[#F5F2EA] hover:text-[#0B0B0B] border border-[#2A2A2A]'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ({inCart.quantity})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-2xl bg-[#161616] border border-[#242424] max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#202020] text-[#FFC928] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#F5F2EA]">
              No dishes found
            </h3>
            <p className="text-xs text-[#A6A6A6]">
              We couldn't find any dishes matching your current filter. Try choosing another category or clearing your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
