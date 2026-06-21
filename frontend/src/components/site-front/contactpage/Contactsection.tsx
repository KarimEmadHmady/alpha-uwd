"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface ContactSectionProps {
  data: any;
  BASE_URL: string;
  lang: string;
}

export default function ContactSection({ data, BASE_URL, lang }: ContactSectionProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add your API call / form submission logic
    setShowPopup(true);
  };

  const handleBackToHome = () => {
    setShowPopup(false);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

return (
  <section className="w-full px-6 py-16 bg-white dark:bg-[#1a1a1a] relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    {/* ── Thank You Popup ── */}
    {showPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl px-10 py-12 max-w-sm w-full mx-4 text-center animate-fade-in">
          {/* Coin icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">$</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#00437A] mb-3">
            {safeData.popupTitle || 'Thank You!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            {safeData.popupMessage1 || "We Appreciate That You've Taken The Time To Write Us."}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {safeData.popupMessage2 || "We'll Get Back To You Very Soon"}
          </p>

          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {safeData.popupButtonText || 'Back To Home'}
            <span className="w-6 h-6 bg-[#00437A] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    )}

    {/* ── Main Content ── */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      {/* Left Column */}
      <div>
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-50 mb-4">
          {safeData.title || 'Get In Touch'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-md">
          {safeData.subtitle || 'At Alpha Asset Management, We Provide The Tools, Insights, And Personalised Strategies You Need To Make Informed Financial'}
        </p>

        {/* Info Card */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex gap-2">
              <span className="font-bold min-w-[110px] text-gray-800 dark:text-gray-50">Phone Number:</span>
              <span>{safeData.phoneNumber || '01121622277 – 0235380104 – 0235380105'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold min-w-[110px] text-gray-800 dark:text-gray-50">Address:</span>
              <span>
                {safeData.address || 'Smart Village, Building Emerald Business Center No. 2210 B, Giza, Egypt'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold min-w-[110px] text-gray-800 dark:text-gray-50">E-Mail:</span>
              <span>{safeData.email || 'Alpha Asset Management'}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <span className="font-bold text-gray-800 dark:text-gray-50">
                {safeData.socialNetworkLabel || 'Social Network'}
              </span>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 bg-[#00437A] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Phone/WhatsApp */}
              <a href="#" className="w-8 h-8 bg-[#00437A] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-8 h-8 bg-[#00437A] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 h-40 bg-gray-100 dark:bg-gray-900">
          <iframe
            title="Alpha Asset Management Location"
            src="https://maps.google.com/maps?q=Smart+Village+Giza+Egypt&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Right Column – Form */}
      <div className="bg-[#00437A] rounded-2xl p-8 text-white">
        <h3 className="text-lg font-bold mb-1">{safeData.formTitle || 'Connect With Our Team'}</h3>
        <p className="text-sm text-blue-200 mb-6">
          {safeData.formSubtitle || "Have Questions Or Need Personalized Financial Guidance? Fill Out The Form Below To Connect With Alpha Asset Management's Expert"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={safeData.formNamePlaceholder || 'Your Name'}
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="email"
            name="email"
            placeholder={safeData.formEmailPlaceholder || 'E-Mail'}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="tel"
            name="phone"
            placeholder={safeData.formPhonePlaceholder || 'Phone Number'}
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-full bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="company"
            placeholder={safeData.formCompanyPlaceholder || 'Company Name'}
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-full bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            name="message"
            placeholder={safeData.formMessagePlaceholder || 'Message...'}
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-2xl bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-white text-[#00437A] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
            >
              {safeData.formButtonText || 'Send'}
              <span className="w-6 h-6 bg-[#00437A] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <style jsx>{`
      @keyframes fade-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fade-in { animation: fade-in 0.25s ease-out; }
    `}</style>
  </section>
);
}