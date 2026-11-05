import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShoppingBag, MapPin, Phone, User, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder, getStoredSettings } from '../services/orderService';
import { OrderRecord } from '../types/order';
import { CAFE_INFO } from '../data/menuData';

export const CheckoutModal: React.FC<{
  onTrackOrder?: (orderNumber: string, phone: string) => void;
}> = ({ onTrackOrder }) => {
  const {
    items,
    clearCart,
    subtotal,
    deliveryFee,
    grandTotal,
    customerForm,
    setCustomerForm,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen
  } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  const settings = getStoredSettings();

  if (!isCheckoutModalOpen) return null;

  // Handle Order Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!settings.onlineOrderingActive) {
      setErrorMsg('ONLINE ORDERING IS CURRENTLY UNAVAILABLE. Please contact the cafe directly.');
      return;
    }

    if (!customerForm.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerForm.phone.trim()) {
      setErrorMsg('Please enter your active phone number.');
      return;
    }
    if (customerForm.orderType === 'delivery' && !customerForm.deliveryAddress.trim()) {
      setErrorMsg('Please provide your complete delivery address in Mian Channu.');
      return;
    }

    if (subtotal < settings.minimumOrder) {
      setErrorMsg(`Minimum order amount is PKR ${settings.minimumOrder.toLocaleString()}.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrder({
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        orderType: customerForm.orderType,
        deliveryAddress: customerForm.deliveryAddress,
        deliveryLandmark: customerForm.deliveryLandmark,
        specialInstructions: customerForm.specialInstructions,
        cartItems: items,
        deliveryFee: settings.deliveryFee
      });

      if (result.success && result.order) {
        setPlacedOrder(result.order);
        clearCart();
      } else {
        setErrorMsg(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating your order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setPlacedOrder(null);
  };

  const openWhatsAppConfirmation = () => {
    if (!placedOrder) return;
    const msg = encodeURIComponent(
      `Hello Sam's Cafe! I just placed Order #${placedOrder.order_number} for ${placedOrder.order_type.toUpperCase()}.\nTotal: PKR ${placedOrder.total.toLocaleString()}.\nName: ${placedOrder.customer_name}. Please confirm availability and prep time.`
    );
    window.open(`https://wa.me/${CAFE_INFO.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#141414] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#202020] bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#222222] text-[#FFC928] flex items-center justify-center font-bold text-sm">
              S
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#F5F2EA] leading-none">
                {placedOrder ? 'Order Confirmation' : 'Complete Your Order'}
              </h3>
              <span className="text-xs text-[#A6A6A6]">
                {placedOrder ? 'Saved to Live Database' : "Sam's Cafe Online Checkout"}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close checkout modal"
            className="p-2 rounded-xl bg-[#202020] hover:bg-[#2A2A2A] text-[#A6A6A6] hover:text-[#F5F2EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {placedOrder ? (
            /* ORDER PLACED SUCCESSFULLY VIEW (Part 7) */
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#182B18] text-[#4ADE80] border border-[#225522] flex items-center justify-center mx-auto shadow-lg shadow-[#4ADE80]/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#FFC928] font-display">
                  THANK YOU FOR YOUR ORDER
                </span>
                <h4 className="font-display font-black text-2xl text-[#F5F2EA]">
                  ORDER PLACED SUCCESSFULLY!
                </h4>
                <p className="text-xs text-[#A6A6A6]">
                  Your order is registered in our live kitchen system with status <strong className="text-[#FFC928]">PENDING</strong>.
                </p>
              </div>

              {/* Order Receipt Details Card */}
              <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-left space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                  <div>
                    <span className="text-[#737373] uppercase tracking-wider block text-[10px]">Order Number</span>
                    <strong className="text-base text-[#FFC928] font-display font-bold">
                      #{placedOrder.order_number}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[#737373] uppercase tracking-wider block text-[10px]">Order Type</span>
                    <span className="font-bold uppercase text-[#F5F2EA] px-2 py-0.5 rounded bg-[#252525]">
                      {placedOrder.order_type}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>Customer Name</span>
                    <span className="text-[#F5F2EA] font-semibold">{placedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>Phone Number</span>
                    <span className="text-[#F5F2EA] font-semibold tabular-nums">{placedOrder.customer_phone}</span>
                  </div>
                  {placedOrder.order_type === 'delivery' && placedOrder.delivery_address && (
                    <div className="flex justify-between text-[#A6A6A6] pt-1">
                      <span>Delivery Address</span>
                      <span className="text-[#F5F2EA] font-semibold max-w-[60%] text-right">{placedOrder.delivery_address}</span>
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="pt-3 border-t border-[#252525] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    Ordered Items:
                  </span>
                  {placedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#F5F2EA]">
                      <span>{it.item_name_snapshot} × {it.quantity}</span>
                      <span className="tabular-nums font-semibold">PKR {it.line_total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-[#252525] flex justify-between items-center text-sm">
                  <span className="font-bold text-[#F5F2EA]">Total Amount (PKR)</span>
                  <span className="font-display font-black text-lg text-[#FFC928] tabular-nums">
                    PKR {placedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    if (onTrackOrder) {
                      onTrackOrder(placedOrder.order_number, placedOrder.customer_phone);
                    }
                  }}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#FFC928] hover:bg-[#E5A900] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Track Order Live
                </button>

                <button
                  onClick={openWhatsAppConfirmation}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-[#291818] border border-[#522020] text-xs text-[#F87171]">
                  {errorMsg}
                </div>
              )}

              {/* 1. ORDER TYPE SELECTOR: ONLY TWO OPTIONS (Part 5) */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#A6A6A6] block mb-2">
                  Order Type (Select One)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerForm({ ...customerForm, orderType: 'pickup' })}
                    className={`py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                      customerForm.orderType === 'pickup'
                        ? 'bg-[#FFC928] text-[#0B0B0B] border-[#FFC928] shadow-md'
                        : 'bg-[#1A1A1A] text-[#A6A6A6] border-[#2B2B2B] hover:text-[#F5F2EA]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>1. PICKUP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerForm({ ...customerForm, orderType: 'delivery' })}
                    className={`py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                      customerForm.orderType === 'delivery'
                        ? 'bg-[#FFC928] text-[#0B0B0B] border-[#FFC928] shadow-md'
                        : 'bg-[#1A1A1A] text-[#A6A6A6] border-[#2B2B2B] hover:text-[#F5F2EA]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>2. DELIVERY</span>
                  </button>
                </div>

                {customerForm.orderType === 'pickup' ? (
                  <p className="text-[11px] text-[#4ADE80] mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Collect freshly prepared from the counter at Sam's Cafe.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#FFC928] mt-2">
                    Delivered directly to your door in Mian Channu (PKR {settings.deliveryFee} standard delivery charge).
                  </p>
                )}
              </div>

              {/* 2. CUSTOMER DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    placeholder="03XX XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. CONDITIONAL DELIVERY FIELDS */}
              {customerForm.orderType === 'delivery' && (
                <div className="space-y-4 pt-1 border-t border-[#202020] animate-in fade-in duration-200">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                      Delivery Address in Mian Channu *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customerForm.deliveryAddress}
                      onChange={(e) => setCustomerForm({ ...customerForm, deliveryAddress: e.target.value })}
                      placeholder="House / Flat #, Street, Block or Area..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerForm.deliveryLandmark}
                      onChange={(e) => setCustomerForm({ ...customerForm, deliveryLandmark: e.target.value })}
                      placeholder="e.g. Near City Hospital, Main Chowk"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                  Special Notes or Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customerForm.specialInstructions}
                  onChange={(e) => setCustomerForm({ ...customerForm, specialInstructions: e.target.value })}
                  placeholder="e.g. Less spicy, extra sauce, call when arriving"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                />
              </div>

              {/* 4. TOTALS SUMMARY */}
              <div className="p-4 rounded-xl bg-[#181818] border border-[#242424] space-y-2 text-xs">
                <div className="flex justify-between text-[#A6A6A6]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#F5F2EA] tabular-nums">PKR {subtotal.toLocaleString()}</span>
                </div>
                {customerForm.orderType === 'delivery' && (
                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#F5F2EA] tabular-nums">PKR {settings.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#F5F2EA] pt-2 border-t border-[#242424]">
                  <span>Total Amount</span>
                  <span className="font-display font-black text-base text-[#FFC928] tabular-nums">
                    PKR {(subtotal + (customerForm.orderType === 'delivery' ? settings.deliveryFee : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full py-4 px-5 rounded-xl bg-[#FFC928] hover:bg-[#E5A900] text-[#0B0B0B] font-display font-black text-xs uppercase tracking-widest shadow-xl shadow-[#FFC928]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'RECORDING ORDER IN SYSTEM...' : 'PLACE ORDER (CASH ON DELIVERY / COUNTER)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
