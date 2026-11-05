import React from 'react';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const FeaturedMenu: React.FC = () => {
  const { addToCart, items: cartItems } = useCart();

  const featuredIds = ['pizza-sam-special', 'burger-double-smash', 'wings-hot-buffalo', 'coffee-caramel-latte'];
  const featuredList = MENU_ITEMS.filter((item) => featuredIds.includes(item.id));

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
    <section id="featured" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-28 bg-[#0B0B0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
                CHEF'S PICKS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA]">
              THE GOOD STUFF.
            </h2>
            <p className="text-sm sm:text-base text-[#A6A6A6] max-w-lg">
              Explore some of the favourites worth discovering.
            </p>
          </div>

          <a
            href="#menu"
            onClick={handleScrollToMenu}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-[#FFC928] hover:text-[#E5A900] transition-colors group self-start md:self-auto cursor-pointer"
          >
            <span>VIEW FULL MENU</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Featured Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredList.map((item) => {
            const inCart = cartItems.find((ci) => ci.item.id === item.id);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#FFC928]/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#FFC928]/5 hover:-translate-y-1"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-85" />

                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0B0B]/90 border border-[#2A2A2A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5F2EA] font-display">
                      {item.category}
                    </span>
                  </div>

                  {item.isPopular && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#FFC928] text-[#0B0B0B] text-[10px] font-black uppercase tracking-wider font-display">
                      Popular
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-[#F5F2EA] group-hover:text-[#FFC928] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#A6A6A6] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Add Action */}
                  <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-[#737373] tracking-wider block font-semibold">Price</span>
                      <span className="text-base font-bold font-display text-[#FFC928] tabular-nums">
                        PKR {item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      aria-label={`Add ${item.name} to order`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        inCart
                          ? 'bg-[#1F2E1F] text-[#4ADE80] border border-[#225522]'
                          : 'bg-[#1C1C1C] hover:bg-[#FFC928] text-[#F5F2EA] hover:text-[#0B0B0B] border border-[#2A2A2A]'
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
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
