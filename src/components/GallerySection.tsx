import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/menuData';

export const GallerySection: React.FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_PHOTOS.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhotoIndex]);

  return (
    <section id="gallery" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-28 bg-[#0B0B0B] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#242424]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
              MOMENTS & FLAVOURS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA]">
            A LITTLE TASTE OF SAM'S.
          </h2>
          <p className="text-sm sm:text-base text-[#A6A6A6]">
            Take a visual tour through our signature pizzas, stacked burgers, crispy wings, and specialty coffee.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className={`group relative rounded-2xl overflow-hidden bg-[#141414] border border-[#242424] cursor-pointer hover:border-[#FFC928]/50 transition-all duration-300 shadow-lg hover:shadow-2xl ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity p-6 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC928] font-display">
                      {photo.category}
                    </span>
                    <div className="p-1.5 rounded-lg bg-black/60 text-[#FFC928] border border-white/10 group-hover:bg-[#FFC928] group-hover:text-black transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#F5F2EA]">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-[#A6A6A6] mt-0.5 line-clamp-1">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal with z-[70] */}
      {activePhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            aria-label="Close image preview"
            className="absolute top-5 right-5 p-3 rounded-full bg-[#181818] border border-[#2E2E2E] text-white hover:text-[#FFC928] hover:border-[#FFC928] transition-colors z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length : 0
              );
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181818]/90 border border-[#2E2E2E] text-white hover:text-[#FFC928] hover:border-[#FFC928] transition-colors z-10 hidden sm:block cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev + 1) % GALLERY_PHOTOS.length : 0
              );
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181818]/90 border border-[#2E2E2E] text-white hover:text-[#FFC928] hover:border-[#FFC928] transition-colors z-10 hidden sm:block cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#282828] shadow-2xl bg-[#121212]">
              <img
                src={GALLERY_PHOTOS[activePhotoIndex].src}
                alt={GALLERY_PHOTOS[activePhotoIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain"
              />
              <div className="p-4 bg-[#141414] border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#FFC928] tracking-wider font-display">
                      {GALLERY_PHOTOS[activePhotoIndex].category}
                    </span>
                    <span className="text-[#555]">·</span>
                    <span className="text-xs text-[#A6A6A6]">
                      Photo {activePhotoIndex + 1} of {GALLERY_PHOTOS.length}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-[#F5F2EA]">
                    {GALLERY_PHOTOS[activePhotoIndex].title}
                  </h4>
                  <p className="text-xs text-[#A6A6A6] mt-0.5">
                    {GALLERY_PHOTOS[activePhotoIndex].caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:hidden pt-2">
                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) =>
                        prev !== null ? (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length : 0
                      )
                    }
                    className="flex-1 py-2 bg-[#202020] rounded-lg text-xs font-semibold text-white"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) =>
                        prev !== null ? (prev + 1) % GALLERY_PHOTOS.length : 0
                      )
                    }
                    className="flex-1 py-2 bg-[#202020] rounded-lg text-xs font-semibold text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
