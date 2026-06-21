import Image from "next/image";

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

interface FinancialServicesGridProps {
  data: any;
  BASE_URL: string;
  lang?: string;
}

function truncate(text: string, maxLength: number = 55): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

interface ServiceCardProps {
  card: ServiceCard;
}

function ServiceCardItem({ card }: ServiceCardProps) {
return (
    <div className="group relative bg-white dark:bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-md dark:shadow-black/30 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={card.imageUrl}
          alt={card.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-50 mb-1 group-hover:text-[#00437A] dark:group-hover:text-[#00437A] transition-colors duration-200">
          {card.title}
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
          {truncate(card.description)}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00437A] group-hover:w-full transition-all duration-300 rounded-full" />
    </div>
  );
}

export default function FinancialServicesGrid({ data, BASE_URL, lang }: FinancialServicesGridProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';
  
  // Build services array from dynamic data
  const services: ServiceCard[] = [
    {
      id: 1,
      title: safeData.service1Title || 'Funds Management',
      description: safeData.service1Description || 'We manage a diverse range of investment funds tailored to your financial goals.',
      imageUrl: safeData.service1Image?.startsWith('http') ? safeData.service1Image : (safeData.service1Image ? `${BASE_URL}/${safeData.service1Image}` : 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=220&fit=crop'),
      imageAlt: 'Funds Management',
    },
    {
      id: 2,
      title: safeData.service2Title || 'Portfolio Management',
      description: safeData.service2Description || 'One of the leading companies in portfolio strategy and asset allocation.',
      imageUrl: safeData.service2Image?.startsWith('http') ? safeData.service2Image : (safeData.service2Image ? `${BASE_URL}/${safeData.service2Image}` : 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=220&fit=crop'),
      imageAlt: 'Portfolio Management',
    },
    {
      id: 3,
      title: safeData.service3Title || 'Cash Management',
      description: safeData.service3Description || 'Alpha Financial Investments provides expert cash flow optimization.',
      imageUrl: safeData.service3Image?.startsWith('http') ? safeData.service3Image : (safeData.service3Image ? `${BASE_URL}/${safeData.service3Image}` : 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=220&fit=crop'),
      imageAlt: 'Cash Management',
    },
    {
      id: 4,
      title: safeData.service4Title || 'Private Pension Funds',
      description: safeData.service4Description || 'Specializes in managing private pension portfolios for long-term security.',
      imageUrl: safeData.service4Image?.startsWith('http') ? safeData.service4Image : (safeData.service4Image ? `${BASE_URL}/${safeData.service4Image}` : 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=220&fit=crop'),
      imageAlt: 'Private Pension Funds',
    },
    {
      id: 5,
      title: safeData.service5Title || 'Managing Family Business',
      description: safeData.service5Description || 'Provides family portfolio management and multi-generational wealth planning.',
      imageUrl: safeData.service5Image?.startsWith('http') ? safeData.service5Image : (safeData.service5Image ? `${BASE_URL}/${safeData.service5Image}` : 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=220&fit=crop'),
      imageAlt: 'Managing Family Business',
    },
  ];

return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-12 px-6" dir={safeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCardItem key={service.id} card={service} />
          ))}
        </div>
      </div>
    </section>
  );
}