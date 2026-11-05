import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';
import { submitContactInquiry } from '../services/orderService';

export const LocationContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactInquiry(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Could not send message. Please reach us directly on WhatsApp or phone.');
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Sam's Cafe! Name: ${formData.name || 'Guest'}. Subject: ${formData.subject || 'General Inquiry'}. ${formData.message}`
    );
    window.open(`https://wa.me/${CAFE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="scroll-mt-20 lg:scroll-mt-24 py-20 lg:py-28 bg-[#0B0B0B] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#242424]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] font-display">
              VISIT & CONNECT
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#F5F2EA]">
            LET'S MAKE YOUR NEXT VISIT SPECIAL.
          </h2>
          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-xl mx-auto">
            Have a question, planning a visit, or craving something delicious? We'd love to hear from you.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Location Details, Hours & Action Buttons */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#141414] border border-[#242424] shadow-xl space-y-6">
              
              {/* LOCATION BLOCK */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#1C1C1C] text-[#FFC928] shrink-0 border border-[#282828]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] font-display block">
                    LOCATION
                  </span>
                  <p className="text-sm font-semibold text-[#F5F2EA] leading-relaxed">
                    Allama Iqbal Road, Mian Channu, Pakistan.
                  </p>
                </div>
              </div>

              {/* PHONE BLOCK */}
              <div className="flex items-start gap-4 pt-4 border-t border-[#1E1E1E]">
                <div className="p-3 rounded-xl bg-[#1C1C1C] text-[#FFC928] shrink-0 border border-[#282828]">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] font-display block">
                    PHONE
                  </span>
                  <a
                    href={`tel:${CAFE_INFO.phoneRaw}`}
                    className="text-base font-bold text-[#F5F2EA] hover:text-[#FFC928] transition-colors tabular-nums block"
                  >
                    +92 344 4443322
                  </a>
                </div>
              </div>

              {/* OPENING HOURS BLOCK */}
              <div className="flex items-start gap-4 pt-4 border-t border-[#1E1E1E]">
                <div className="p-3 rounded-xl bg-[#1C1C1C] text-[#FFC928] shrink-0 border border-[#282828]">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] font-display block">
                    OPENING HOURS
                  </span>
                  <p className="text-sm font-medium text-[#F5F2EA] leading-relaxed">
                    10:00 AM – 2:00 AM daily, subject to restaurant confirmation.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-[#1E1E1E] space-y-3">
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#E5A900] active:scale-98 transition-all shadow-lg shadow-[#FFC928]/10 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={`tel:${CAFE_INFO.phoneRaw}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F2EA] border border-[#282828] hover:border-[#FFC928]/40 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#FFC928]" />
                  <span>CALL SAM'S CAFE</span>
                </a>
              </div>
            </div>

            {/* WORKING CONTACT FORM (Part 19) */}
            <div className="p-8 rounded-3xl bg-[#141414] border border-[#242424] shadow-xl space-y-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[#F5F2EA]">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-[#A6A6A6]">
                  Leave an inquiry, feedback, or table question.
                </p>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-[#152915] border border-[#205220] text-xs text-[#4ADE80] flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you! Your message has been received by Sam's Cafe.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-[#291818] border border-[#522020] text-xs text-[#F87171]">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="03XX XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Table reservation, event catering"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#A6A6A6] tracking-wider block mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#E5A900] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsAppInquiry}
                      title="Send via WhatsApp"
                      className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Large Premium Map Card */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#242424] bg-[#141414] shadow-2xl flex flex-col">
              
              {/* Card Top Title Bar */}
              <div className="p-4 bg-[#181818] border-b border-[#202020] flex items-center justify-between text-xs text-[#A6A6A6]">
                <div className="flex items-center gap-2 font-medium text-[#F5F2EA]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFC928] shadow-[0_0_8px_#FFC928]" />
                  <span>Interactive Map Preview</span>
                </div>
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFC928] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Embed */}
              <div className="relative h-[360px] sm:h-[420px] w-full bg-[#101010]">
                <iframe
                  title="Sam's Cafe Location in Mian Channu"
                  src="https://maps.google.com/maps?q=Sam's+Cafe+Allama+Iqbal+Road+Mian+Channu+Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 filter grayscale-[70%] invert-[90%] contrast-[120%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Bottom Editorial Copy (Exact Prompt Requirement) */}
              <div className="p-6 bg-[#161616] border-t border-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-display font-black text-lg text-[#F5F2EA] tracking-tight">
                    FIND YOUR WAY TO SAM'S.
                  </h4>
                  <p className="text-xs text-[#A6A6A6]">
                    Good food is closer than you think.
                  </p>
                </div>

                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F1F1F] hover:bg-[#FFC928] text-[#F5F2EA] hover:text-[#0B0B0B] border border-[#2B2B2B] hover:border-[#FFC928] font-display font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FFC928] group-hover:text-black" />
                  <span>Open Directions</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
