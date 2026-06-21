import Image from 'next/image';
import Link from 'next/link';

interface CareerHeroProps {
  applyUrl?: string;
  lang?: string;
  content?: Record<string, any>;
}

const translations = {
  en: { badge: "Careers", cta: "Apply Now" },
  ar: { badge: "الوظائف", cta: "قدم الآن" },
};

export default function CareerHero({ applyUrl = "/careers/applyform", lang = "en", content = {} }: CareerHeroProps) {
  const isArabic = lang === "ar";
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1a3560] px-6 py-16 text-center text-white" dir={isArabic ? "rtl" : "ltr"}>
      {/* Background pattern image */}
      <Image
        src="/Group 5.png"
        alt="Background Pattern"
        fill
        className="object-cover opacity-90 absolute inset-0 z-0"
      />
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1d4ed8 0%, transparent 40%)",
        }}
      />

      {/* Badge */}
      <div className="relative mb-6 flex justify-center">
        <span className="rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-sm font-medium tracking-wide backdrop-blur-sm">
          {t.badge}
        </span>
      </div>

      {/* Headline */}
      <h1 className="relative mb-4 text-4xl font-bold leading-tight md:text-5xl">
        {content?.title?.[lang] || (isArabic ? "انضم إلى مستقبل التمويل" : "Join The Future Of Finance")}
      </h1>

      {/* Subtitle */}
      <p className="relative mx-auto mb-8 max-w-lg text-sm text-white/70 md:text-base">
        {content?.subtitle?.[lang] || (isArabic ? "انضم إلى فريق من الرؤى والخبراء الماليين المكرسين لتحديث إدارة الثروات من خلال التكنولوجيا" : "Join A Team Of Visionaries, And Financial Experts Dedicated To Democratizing Wealth Management Through Technology")}
      </p>

      {/* CTA Button */}
      <Link
        href={applyUrl}
        className="relative inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
      >
        {t.cta}
        <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ${isArabic ? "rotate-180" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
