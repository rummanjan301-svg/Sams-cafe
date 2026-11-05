import React from 'react';
import { Users, Utensils, Sparkles, Coffee } from 'lucide-react';

export const AboutSection: React.FC = () => {
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
    <section id="about" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-28 bg-[#121212] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#242424] bg-[#161616] shadow-2xl">
              <img
                src="/src/assets/images/food_smash_burger_1793898484448.jpg"
                alt="Gourmet smash burgers at Sam's Cafe"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/85 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#121212]/95 border border-[#262626] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#FFC928] tracking-widest block font-display">
                    Crafted With Passion
                  </span>
                  <span className="text-sm font-bold text-[#F5F2EA] font-display">
                    Fresh Quality In Every Bite
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FFC928]/10 text-[#FFC928] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#262626]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
                ABOUT OUR CAFE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA] leading-tight">
              MORE THAN<br />
              <span className="text-[#FFC928]">JUST A MEAL.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#F5F2EA]/90 font-normal leading-relaxed">
              Sam's Cafe is a place to enjoy good food, catch up with friends, and make everyday moments a little more special. Explore the menu and discover your next favourite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1F1F1F]">
              <div className="p-4 rounded-xl bg-[#161616] border border-[#242424] space-y-1">
                <div className="flex items-center gap-2 text-[#FFC928]">
                  <Utensils className="w-4 h-4" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">Quality Ingredients</span>
                </div>
                <p className="text-xs text-[#A6A6A6] leading-relaxed">
                  Real cheeses, succulent marinated chicken, and artisan dough prepared fresh to order.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#161616] border border-[#242424] space-y-1">
                <div className="flex items-center gap-2 text-[#FFC928]">
                  <Users className="w-4 h-4" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">Welcoming Vibe</span>
                </div>
                <p className="text-xs text-[#A6A6A6] leading-relaxed">
                  A comfortable, relaxed environment designed for friends, families, and evening cravings.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#menu"
                onClick={handleScrollToMenu}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F2EA] border border-[#2B2B2B] hover:border-[#FFC928]/40 font-display font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Explore The Menu</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
