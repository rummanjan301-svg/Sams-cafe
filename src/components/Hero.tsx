import React from 'react';
import { ArrowDown, ChevronRight, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
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

  const handleScrollToLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const navHeight = 76;
      const elementPosition = contactEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="scroll-mt-24 relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0B0B0B]"
    >
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg"
          alt="Sam's Cafe Artisan Feast - Gourmet pizza, smash burger and crispy fries"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100 transform-gpu"
        />
        {/* Measured dark gradient scrims - ensures high contrast legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-[#0B0B0B]/40 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/70" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Advertising Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Eyebrow & Red Accent Marker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121212]/90 border border-[#262626]">
              <span className="w-2 h-2 rounded-full bg-[#D62828] shadow-[0_0_8px_#D62828]" />
              <span className="text-xs font-semibold tracking-widest text-[#FFC928] uppercase font-display">
                GOOD FOOD. GREAT MOMENTS.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-black tracking-tight text-[#F5F2EA] leading-[1.06] text-balance">
              CRAVINGS<br />
              DESERVE<br />
              <span className="text-[#FFC928]">
                BETTER.
              </span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[#F5F2EA]/85 max-w-xl font-normal leading-relaxed">
              From cheesy pizza nights to your favourite bites and coffee moments,
              discover the authentic taste of <strong className="text-[#F5F2EA] font-semibold">Sam's Cafe</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#menu"
                onClick={handleScrollToMenu}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs tracking-wider uppercase hover:bg-[#E5A900] active:scale-95 transition-all shadow-xl shadow-[#FFC928]/15 group cursor-pointer"
              >
                <span>EXPLORE OUR MENU</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                onClick={handleScrollToLocation}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-[#F5F2EA] border border-[#2B2B2B] hover:border-[#FFC928]/50 font-display font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#FFC928]" />
                <span>FIND OUR LOCATION</span>
              </a>
            </div>

            {/* Micro Details - Clean without repetitive address */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#A6A6A6]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
                <span>Fresh Stone-Fired Dough</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
                <span>Fast Takeaway & Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Badge & Visual Composition */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-sm">
              {/* Badge Card */}
              <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] shadow-2xl space-y-3.5 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-[#FFC928] uppercase font-display">
                    YOUR LOCAL FOOD SPOT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D62828]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#F5F2EA] leading-snug">
                  Artisan Pizzas, Smash Burgers & Hot Skillet Wings
                </h3>
                <p className="text-xs text-[#A6A6A6] leading-relaxed">
                  Crafted fresh daily with melted mozzarella pulls, freshly ground burger patties, and bold spices.
                </p>
                <div className="pt-3 flex items-center justify-between border-t border-[#222222] text-xs">
                  <span className="text-[#A6A6A6]">Hours:</span>
                  <span className="text-[#FFC928] font-semibold">10:00 AM – 2:00 AM (Next Day)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <a
        href="#highlights"
        aria-label="Scroll down to highlights"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-xs text-[#A6A6A6] hover:text-[#FFC928] transition-colors group cursor-pointer"
      >
        <span className="tracking-widest uppercase text-[10px] font-semibold font-display">Scroll</span>
        <div className="w-7 h-7 rounded-full border border-[#282828] flex items-center justify-center bg-[#141414] group-hover:border-[#FFC928] transition-all">
          <ArrowDown className="w-3.5 h-3.5 text-[#FFC928] animate-bounce" />
        </div>
      </a>
    </section>
  );
};
