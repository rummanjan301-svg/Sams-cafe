import React from 'react';
import { Flame, Pizza, Coffee, Heart } from 'lucide-react';

export const BrandHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Flame,
      title: 'Freshly Prepared',
      description: 'Cooked hot to order for genuine taste and crunch.'
    },
    {
      icon: Pizza,
      title: 'Pizza & Fast Food',
      description: 'Artisan crusts, loaded burgers, and crispy wings.'
    },
    {
      icon: Coffee,
      title: 'Coffee & Refreshments',
      description: 'Handcrafted espresso, lattes, and chilled coolers.'
    },
    {
      icon: Heart,
      title: 'Great Moments',
      description: 'A cozy, welcoming space designed for great food and friends.'
    }
  ];

  return (
    <section id="highlights" className="relative z-20 bg-[#121212] border-y border-[#1C1C1C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#161616] border border-[#222222] hover:border-[#FFC928]/30 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-[#1F1F1F] text-[#FFC928] group-hover:bg-[#FFC928] group-hover:text-[#0B0B0B] transition-all shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm tracking-wide text-[#F5F2EA] group-hover:text-[#FFC928] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A6A6A6] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
