import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, AlertTriangle, ArrowLeft, RefreshCw, PackageCheck, Flame, Bike, Check } from 'lucide-react';
import { trackOrder } from '../services/orderService';
import { OrderRecord, OrderStatus } from '../types/order';

export const TrackOrderView: React.FC<{
  initialOrderNumber?: string;
  initialPhone?: string;
  onBackToHome: () => void;
}> = ({ initialOrderNumber = '', initialPhone = '', onBackToHome }) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMessage('Please enter both your Order Number and Phone Number to verify your order.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const found = await trackOrder(orderNumber, phone);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setErrorMessage('No matching order was found with this Order Number and Phone Number. Please check your details.');
      }
    } catch {
      setErrorMessage('Could not connect to verify your order. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      handleSearch();
    }
  }, [initialOrderNumber, initialPhone]);

  // Periodic poll to refresh live order state while customer is on this page
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(async () => {
      const updated = await trackOrder(order.order_number, order.customer_phone);
      if (updated) setOrder(updated);
    }, 8000);
    return () => clearInterval(interval);
  }, [order]);

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'PENDING', label: 'ORDER PLACED', desc: 'Received in queue' },
    { key: 'ACCEPTED', label: 'ACCEPTED', desc: 'Confirmed by kitchen' },
    { key: 'PREPARING', label: 'PREPARING', desc: 'Cooking fresh now' },
    { key: 'READY', label: 'READY', desc: order?.order_type === 'delivery' ? 'Out for delivery' : 'Ready at counter' },
    { key: 'COMPLETED', label: 'COMPLETED', desc: 'Order fulfilled' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      default: return -1;
    }
  };

  const currentStageIndex = order ? getStageIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#A6A6A6] hover:text-[#FFC928] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sam's Cafe</span>
          </button>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFC928] font-display">
            Live Kitchen Tracking
          </span>
        </div>

        {/* Search Header */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-[#242424] shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F5F2EA] tracking-tight">
              TRACK YOUR ORDER
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A6]">
              Enter your Order Number (e.g. SAM-1234) and registered phone number to view live kitchen progress.
            </p>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="SAM-XXXX"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-sm text-[#F5F2EA] font-display uppercase tracking-wider focus:border-[#FFC928] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXXXXXX"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-sm text-[#F5F2EA] tabular-nums focus:border-[#FFC928] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FFC928] hover:bg-[#E5A900] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#291818] border border-[#522020] text-xs text-[#F87171] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Found Order Card */}
        {order && (
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#242424] shadow-2xl space-y-8 animate-in fade-in duration-300">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#202020]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#737373] tracking-widest block font-display">
                  ACTIVE ORDER
                </span>
                <h3 className="font-display font-black text-2xl text-[#FFC928] tracking-tight">
                  #{order.order_number}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-[#222222] text-[#F5F2EA] text-xs font-display font-bold uppercase tracking-wider">
                  {order.order_type}
                </span>

                <div
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider border ${
                    order.status === 'CANCELLED'
                      ? 'bg-[#291818] text-[#F87171] border-[#522020]'
                      : order.status === 'COMPLETED'
                      ? 'bg-[#182B18] text-[#4ADE80] border-[#225522]'
                      : 'bg-[#222014] text-[#FFC928] border-[#554411]'
                  }`}
                >
                  {order.status}
                </div>
              </div>
            </div>

            {/* STATUS TIMELINE */}
            {order.status === 'CANCELLED' ? (
              <div className="p-6 rounded-2xl bg-[#291818] border border-[#522020] text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-[#F87171] mx-auto" />
                <h4 className="font-display font-bold text-base text-[#F87171]">
                  THIS ORDER HAS BEEN CANCELLED
                </h4>
                <p className="text-xs text-[#A6A6A6] max-w-sm mx-auto">
                  Please call the cafe directly at +92 344 4443322 for further assistance or questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A6A6] block">
                  Kitchen Progress Timeline
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {stages.map((st, idx) => {
                    const isDone = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={st.key}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-[#FFC928]/10 border-[#FFC928] text-[#FFC928]'
                            : isDone
                            ? 'bg-[#191919] border-[#2A2A2A] text-[#4ADE80]'
                            : 'bg-[#121212] border-[#202020] text-[#555555]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider font-display">
                            0{idx + 1}
                          </span>
                          {isDone ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </div>
                        <h5 className="font-display font-bold text-xs uppercase tracking-tight">
                          {st.label}
                        </h5>
                        <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1">
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details Breakdown */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-[#222222] space-y-3 text-xs">
              <div className="flex justify-between text-[#A6A6A6] pb-2 border-b border-[#222222]">
                <span>Customer</span>
                <span className="text-[#F5F2EA] font-semibold">{order.customer_name}</span>
              </div>
              {order.order_type === 'delivery' && order.delivery_address && (
                <div className="flex justify-between text-[#A6A6A6] pb-2 border-b border-[#222222]">
                  <span>Delivery Address</span>
                  <span className="text-[#F5F2EA] font-semibold text-right max-w-[60%]">{order.delivery_address}</span>
                </div>
              )}
              {order.items && order.items.length > 0 && (
                <div className="space-y-1.5 py-2 border-b border-[#222222]">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#F5F2EA]">
                      <span>{it.item_name_snapshot} × {it.quantity}</span>
                      <span className="tabular-nums font-semibold">PKR {it.line_total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-[#F5F2EA]">Total Amount</span>
                <span className="text-[#FFC928] font-display font-bold tabular-nums">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
