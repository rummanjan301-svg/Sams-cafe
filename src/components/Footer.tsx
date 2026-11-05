import React from 'react';
import { MapPin, Phone, ArrowUp } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmoothScroll = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      const navHeight = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-[#181818] text-[#A6A6A6] relative pt-16 pb-12">
      {/* Decorative Brand Accent Line: Golden Yellow with tiny red accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#141414] overflow-hidden">
        <div className="h-full w-48 bg-[#FFC928] mx-auto relative">
          <span className="absolute top-0 right-0 w-3 h-full bg-[#D62828]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#181818]">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#FFC928]/35 flex items-center justify-center text-[#FFC928] font-display font-black text-2xl">
                <span>S</span>
              </div>
              <span className="font-display font-black tracking-widest text-xl text-[#F5F2EA] uppercase">
                SAM'S CAFE
              </span>
            </div>
            
            <p className="font-display font-bold text-sm tracking-widest text-[#FFC928] uppercase">
              "GOOD FOOD. GREAT MOMENTS."
            </p>

            <p className="text-xs text-[#8A8A8A] max-w-sm leading-relaxed">
              Serving artisanal pizzas, double smashed burgers, crispy hot wings, and handcrafted coffee on Allama Iqbal Road, Mian Channu.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EA] font-display block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleSmoothScroll(e, 'home')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => handleSmoothScroll(e, 'menu')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Menu & Ordering
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleSmoothScroll(e, 'about')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  About Sam's
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => handleSmoothScroll(e, 'gallery')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Photo Gallery
                </a>
              </li>
              <li>
                <a
                  href="#hours"
                  onClick={(e) => handleSmoothScroll(e, 'hours')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Opening Hours
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, 'contact')}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Location & Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EA] font-display block">
              Visit & Contact
            </span>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
                <span className="text-[#F5F2EA]">
                  {CAFE_INFO.address}, {CAFE_INFO.city}, {CAFE_INFO.country}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC928] shrink-0" />
                <a
                  href={`tel:${CAFE_INFO.phoneRaw}`}
                  className="text-[#F5F2EA] hover:text-[#FFC928] transition-colors tabular-nums font-medium"
                >
                  {CAFE_INFO.phoneDisplay}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFC928] hover:underline font-semibold"
                >
                  <span>Open Location on Google Maps</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <p>© 2026 Sam's Cafe. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="inline-flex items-center gap-1.5 text-xs text-[#A6A6A6] hover:text-[#FFC928] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
