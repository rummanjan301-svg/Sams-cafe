import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

export const SignatureFeature: React.FC = () => {
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
    <section className="py-20 lg:py-28 bg-[#0B0B0B] relative overflow-hidden">
      {/* Subtle Yellow Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FFC928]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Asymmetrical Left Column: Editorial Food Showcase */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#242424] shadow-2xl bg-[#141414] group">
              <img
                src="/src/assets/images/food_artisan_pizza_1793898483490.jpg"
                alt="Artisan Pizza crafted at Sam's Cafe"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-black/20 to-transparent" />

              {/* Highlight Card */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm p-5 rounded-2xl bg-[#141414]/95 border border-[#262626]">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-[#FFC928]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] font-display">
                    Signature Oven Crust
                  </span>
                </div>
                <p className="text-xs text-[#F5F2EA]/90 leading-relaxed">
                  Stone-fired charred bubbles, melted strings of mozzarella, and seasoned chicken baked to golden perfection.
                </p>
              </div>
            </div>

            {/* Accent badge */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-[#FFC928] flex items-center justify-center text-black font-black text-xs shadow-lg">
              ★
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#242424]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
                MOMENTS THAT MATTER
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA] leading-tight">
              MADE FOR YOUR<br />
              <span className="text-[#FFC928]">CRAVINGS.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#A6A6A6] font-normal leading-relaxed">
              Whether it's a casual bite, a pizza night, or a coffee break, make Sam's Cafe part of your next food moment.
            </p>

            <div className="space-y-3 pt-2 text-sm text-[#F5F2EA]/90">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FFC928]" />
                <span>Generous portions crafted for sharing with friends</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FFC928]" />
                <span>Hot and fresh direct from the skillet and oven</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FFC928]" />
                <span>Specialty espresso bar with rosetta latte art</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#menu"
                onClick={handleScrollToMenu}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#E5A900] transition-colors shadow-lg shadow-[#FFC928]/10 cursor-pointer"
              >
                <span>Browse Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
