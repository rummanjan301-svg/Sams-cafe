import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Search, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export type SectionId = 'home' | 'menu' | 'about' | 'gallery' | 'hours' | 'contact';

interface NavLinkItem {
  id: SectionId;
  name: string;
  href: string;
}

export const Navbar: React.FC<{
  currentView?: string;
  onNavigate?: (view: string) => void;
}> = ({ currentView = 'home', onNavigate }) => {
  const { totalQuantity, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const navLinks: NavLinkItem[] = [
    { id: 'home', name: 'Home', href: '#home' },
    { id: 'menu', name: 'Menu', href: '#menu' },
    { id: 'about', name: 'About', href: '#about' },
    { id: 'gallery', name: 'Gallery', href: '#gallery' },
    { id: 'hours', name: 'Hours', href: '#hours' },
    { id: 'contact', name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Scroll spy & scrolled state observer
  useEffect(() => {
    if (currentView !== 'home') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (isClickScrolling.current) return;

      if (scrollY < 100) {
        setActiveSection('home');
        return;
      }

      const scrollPosition = window.innerHeight + scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 80) {
        setActiveSection('contact');
        return;
      }

      const sectionIds: SectionId[] = ['contact', 'hours', 'gallery', 'about', 'menu', 'home'];
      const navOffset = 110;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset && rect.bottom > navOffset) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentView]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();

    if (currentView !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setActiveSection(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    const targetElement = document.getElementById(id);
    if (targetElement) {
      isClickScrolling.current = true;
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      const navHeight = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: id === 'home' ? 0 : offsetPosition,
        behavior: 'smooth',
      });

      scrollTimeoutRef.current = window.setTimeout(() => {
        isClickScrolling.current = false;
      }, 750);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[76px] flex items-center bg-[#0B0B0B] border-b border-[#181818] transition-shadow duration-300 ${
        isScrolled
          ? 'shadow-[0_4px_24px_rgba(0,0,0,0.9)]'
          : 'shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-8 h-full">
          
          {/* Zone 1: Brand Wordmark & Emblem */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC928] rounded-xl shrink-0"
            aria-label="Sam's Cafe Home"
          >
            {/* Custom minimalist 'S' emblem badge */}
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#FFC928]/35 flex items-center justify-center text-[#FFC928] font-display font-black text-2xl tracking-tighter shadow-md group-hover:border-[#FFC928] transition-all">
              <span>S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black tracking-widest text-lg sm:text-xl text-[#F5F2EA] uppercase group-hover:text-[#FFC928] transition-colors leading-tight">
                SAM'S CAFE
              </span>
              <span className="text-[10px] tracking-wider text-[#A6A6A6] font-medium uppercase hidden sm:block">
                Premium Kitchen
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links with Active Yellow Underline */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentView === 'home' && activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative py-2.5 px-1 font-display tracking-wider text-xs uppercase font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#FFC928]'
                      : 'text-[#F5F2EA]/75 hover:text-[#FFC928]'
                  }`}
                >
                  <span>{link.name}</span>

                  {/* Golden-Yellow Active Underline */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FFC928] rounded-full shadow-[0_0_8px_rgba(255,201,40,0.6)] animate-in fade-in zoom-in-75 duration-200"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Track Order, Cart & Explore Menu CTA) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Track Order link button */}
            <button
              onClick={() => onNavigate && onNavigate('track')}
              title="Track Your Order"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] border border-[#242424] text-xs font-semibold text-[#A6A6A6] hover:text-[#FFC928] hover:border-[#FFC928]/40 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#FFC928]" />
              <span>Track Order</span>
            </button>

            {/* Cart Trigger with Yellow Quantity Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping cart with ${totalQuantity} items`}
              className="relative p-2.5 rounded-xl bg-[#161616] border border-[#2A2A2A] text-[#F5F2EA] hover:text-[#FFC928] hover:border-[#FFC928]/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC928] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FFC928] text-[#0B0B0B] text-[11px] font-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Desktop Explore Menu Button */}
            <a
              href="#menu"
              onClick={(e) => handleNavClick(e, 'menu')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs tracking-wider uppercase hover:bg-[#E5A900] active:scale-95 transition-all shadow-md shadow-[#FFC928]/10 cursor-pointer"
            >
              Explore Menu
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2.5 rounded-xl bg-[#161616] border border-[#2A2A2A] text-[#F5F2EA] hover:text-[#FFC928] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 top-[76px] bottom-0 bg-[#0B0B0B] z-50 md:hidden flex flex-col justify-between p-6 border-t border-[#1C1C1C] overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#737373] font-display block mb-3">
              Navigation
            </span>
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = currentView === 'home' && activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-base font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#181818] text-[#FFC928] border-l-4 border-[#FFC928]'
                        : 'text-[#F5F2EA]/85 hover:text-[#FFC928] hover:bg-[#141414]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#FFC928]" />
                    )}
                  </a>
                );
              })}

              {/* Mobile Quick Links: Track Order & Admin */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('track');
                }}
                className="flex items-center justify-between py-3.5 px-4 rounded-xl text-base font-display font-bold uppercase tracking-wider text-[#F5F2EA]/85 hover:text-[#FFC928] hover:bg-[#141414] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#FFC928]" />
                  <span>Track Your Order</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('admin');
                }}
                className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-display font-bold uppercase tracking-wider text-[#A6A6A6] hover:text-[#FFC928] hover:bg-[#141414] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A6A6A6]" />
                  <span>Staff / Admin Portal</span>
                </span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1C1C1C] space-y-4">
            <a
              href="#menu"
              onClick={(e) => handleNavClick(e, 'menu')}
              className="w-full py-3.5 text-center bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FFC928]/10 block"
            >
              Explore Menu
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
