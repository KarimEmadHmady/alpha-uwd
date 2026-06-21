'use client';

import Link from 'next/link';

export default function WhyChooseUsSection() {
return (
    <section className="py-16 bg-gray-50 dark:bg-[#1a1a1a]" dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-[#00437A] rounded-3xl overflow-hidden px-8 py-16 text-center">

          {/* Subtle background circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 text-sm text-white/80">
              Why Choose Us
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-snug">
              Trusted Expertise To Grow And Protect<br />
              Your Wealth
            </h2>

            <p className="text-blue-200 text-sm leading-relaxed">
              Trusted By Thousands Who&apos;ve Built Smarter, More Secure Financial
              Futures With Alpha
            </p>

            <Link
              href="#"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white hover:text-[#00437A] text-white px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200"
            >
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}