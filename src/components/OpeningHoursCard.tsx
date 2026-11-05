import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { getCafeLiveStatus, CafeStatus } from '../utils/hoursUtil';

export const OpeningHoursCard: React.FC = () => {
  const [status, setStatus] = useState<CafeStatus>(getCafeLiveStatus);

  useEffect(() => {
    // Update live status every minute
    const interval = setInterval(() => {
      setStatus(getCafeLiveStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hours" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-24 bg-[#121212] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="p-8 sm:p-10 rounded-3xl bg-[#161616] border border-[#242424] shadow-2xl relative overflow-hidden">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC928]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Live Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#202020]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#202020] text-[#FFC928]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
                    SERVICE SCHEDULE
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-[#F5F2EA] tracking-tight">
                  Opening Hours
                </h3>
              </div>

              {/* Live Status Calculation Indicator */}
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider self-start sm:self-auto border ${
                  status.isOpen
                    ? 'bg-[#152915] text-[#4ADE80] border-[#205220]'
                    : 'bg-[#291818] text-[#F87171] border-[#522020]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.isOpen ? 'bg-[#4ADE80] animate-pulse' : 'bg-[#F87171]'
                  }`}
                />
                <div>
                  <div>{status.statusText}</div>
                  <div className="text-[10px] font-normal opacity-85 lowercase first-letter:uppercase">
                    {status.subText}
                  </div>
                </div>
              </div>
            </div>

            {/* Timings List */}
            <div className="space-y-2.5 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#262626] flex items-center justify-between">
                  <span className="font-semibold text-[#F5F2EA]">Monday – Thursday</span>
                  <span className="text-[#FFC928] font-medium text-xs tabular-nums">10:00 AM – 02:00 AM</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#262626] flex items-center justify-between">
                  <span className="font-semibold text-[#F5F2EA]">Friday – Sunday</span>
                  <span className="text-[#FFC928] font-medium text-xs tabular-nums">10:00 AM – 02:00 AM</span>
                </div>
              </div>
            </div>

            {/* Note & Disclaimer */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] flex items-start gap-3 text-xs text-[#A6A6A6]">
              <AlertCircle className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-[#F5F2EA]">
                  Provisional Hours Notice
                </p>
                <p className="leading-relaxed">
                  These hours reflect public listing records. Please confirm with the cafe staff via phone or WhatsApp before visiting or placing late-night takeaway orders.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
