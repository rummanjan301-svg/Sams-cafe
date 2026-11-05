import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandHighlights } from './components/BrandHighlights';
import { FeaturedMenu } from './components/FeaturedMenu';
import { SignatureFeature } from './components/SignatureFeature';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { OpeningHoursCard } from './components/OpeningHoursCard';
import { LocationContactSection } from './components/LocationContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { ToastNotification } from './components/ToastNotification';
import { TrackOrderView } from './components/TrackOrderView';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'track' | 'admin'>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/track')) return 'track';
    return 'home';
  });

  const [trackingParams, setTrackingParams] = useState<{ orderNumber: string; phone: string }>({
    orderNumber: '',
    phone: ''
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) setCurrentView('admin');
      else if (path.startsWith('/track')) setCurrentView('track');
      else setCurrentView('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'home' | 'track' | 'admin', params?: { orderNumber: string; phone: string }) => {
    setCurrentView(view);
    if (params) {
      setTrackingParams(params);
    }
    const path = view === 'admin' ? '/admin/dashboard' : view === 'track' ? '/track-order' : '/';
    try {
      window.history.pushState({}, '', path);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col selection:bg-[#FFC928] selection:text-black">
        
        {/* Render Customer Tracking View */}
        {currentView === 'track' && (
          <TrackOrderView
            initialOrderNumber={trackingParams.orderNumber}
            initialPhone={trackingParams.phone}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {/* Render Admin Order Dashboard / Login */}
        {currentView === 'admin' && (
          <AdminPortal onExit={() => navigateTo('home')} />
        )}

        {/* Render Main Customer Restaurant Storefront */}
        {currentView === 'home' && (
          <>
            <Navbar currentView={currentView} onNavigate={(v) => navigateTo(v as any)} />

            <main className="flex-1">
              {/* 1. Cinematic Hero */}
              <Hero />

              {/* 2. Brand Highlights Strip */}
              <BrandHighlights />

              {/* 3. Featured Menu ("The Good Stuff") */}
              <FeaturedMenu />

              {/* 4. Signature Food Feature ("Made For Your Cravings") */}
              <SignatureFeature />

              {/* 5. Complete Interactive Menu */}
              <MenuSection />

              {/* 6. About Sam's Cafe ("More Than Just a Meal") */}
              <AboutSection />

              {/* 7. Visual Photo Gallery with Lightbox */}
              <GallerySection />

              {/* 8. Opening Hours Card */}
              <OpeningHoursCard />

              {/* 9. Contact / Visit Us Redesign & Working Form */}
              <LocationContactSection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Checkout Modal (Strictly Pickup & Delivery) */}
            <CheckoutModal
              onTrackOrder={(orderNumber, phone) => {
                navigateTo('track', { orderNumber, phone });
              }}
            />

            {/* Mobile Quick Action Bar with Total Quantity Badge */}
            <MobileQuickBar />

            {/* Non-intrusive Add-to-Cart Toast */}
            <ToastNotification />
          </>
        )}

      </div>
    </CartProvider>
  );
}
