import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ServiceDescriptionProps {
  data: any;
  BASE_URL: string;
  lang?: string;
}

export default function ServiceDescription({ data, BASE_URL, lang }: ServiceDescriptionProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';

  // Build other services array from dynamic data
  const otherServices = [
    { 
      label: safeData.otherService1Label || "Portfolio Management", 
      href: safeData.otherService1Link || "/services/portfolio-management", 
      active: true 
    },
    { 
      label: safeData.otherService2Label || "Cash Management", 
      href: safeData.otherService2Link || "/services/cash-management", 
      active: false 
    },
    { 
      label: safeData.otherService3Label || "Private Pension Funds", 
      href: safeData.otherService3Link || "/services/private-pension-funds", 
      active: false 
    },
    { 
      label: safeData.otherService4Label || "Managing Family Business", 
      href: safeData.otherService4Link || "/services/managing-family-business", 
      active: false 
    },
  ];

  // Build highlights array from dynamic data
  const highlights = [
    safeData.highlight1 || "The Acquisition Of Alpha Financial Investments By More Of Clients",
    safeData.highlight2 || "Provides Liquidity Management Services To High-Net-Worth",
    safeData.highlight3 || "Provides Family Portfolio Management Services",
  ];

return (
    <section className="w-full bg-white dark:bg-[#1a1a1a] px-6 py-10 md:px-12 lg:px-16" dir={safeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left: Service Description */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-4">{safeData.title || 'Service Description'}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {safeData.description || 'We Manage A Diverse Range Of Public Investment Funds Designed To Meet The Needs Of Various Types Of Investors. These Funds Follow Well-Defined Investment Strategies That Span Equity Funds, Fixed Income Funds, Multi-Currency Funds, Real Estate Funds, And Closed-End Funds, Aiming To Achieve An Optimal Balance Between Growth, Returns, And Financial Stability.'}
          </p>

          <ul className="space-y-3">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#1a3c6e] flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Other Services */}
        <div className="w-full md:w-72 lg:w-80">
          <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl p-5 shadow-sm dark:shadow-black/30 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-50 mb-4">{safeData.otherServicesTitle || 'Other Services'}</h3>
            <ul className="space-y-3">
              {otherServices.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      service.active
                        ? "bg-[#1a3c6e] text-white shadow-md"
                        : "bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <span>{service.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}