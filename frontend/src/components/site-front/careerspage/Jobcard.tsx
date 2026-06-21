"use client";

import { useRouter } from "next/navigation";

interface JobCardProps {
  title: string;
  description: string;
  category: string;
  available?: boolean;
  postedAt?: string;
  onApply?: (title: string) => void;
  lang?: string;
}

const translations = {
  en: {
    available: "Available",
    notAvailable: "Not Available",
    apply: "Apply",
  },
  ar: {
    available: "متاح",
    notAvailable: "غير متاح",
    apply: "قدم الآن",
  },
};

export default function JobCard({
  title,
  description,
  category,
  available = true,
  postedAt = "Just Now",
  onApply,
  lang = "en",
}: JobCardProps) {
  const router = useRouter();
  const isArabic = lang === "ar";
  const t = translations[lang as keyof typeof translations] || translations.en;

return (
  <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-5 shadow-sm transition hover:shadow-md">
    {/* Top row: badge + availability */}
    <div className="mb-4 flex items-center justify-between">
      <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
        {category}
      </span>
      <span className={`text-xs font-medium ${available ? "text-green-500" : "text-red-400"}`}>
        {available ? `● ${t.available}` : `● ${t.notAvailable}`}
      </span>
    </div>

    {/* Title */}
    <h3 className="mb-2 text-base font-bold text-gray-800 dark:text-gray-50">{title}</h3>

    {/* Description */}
    <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>

    {/* Bottom row: button + date */}
    <div className="flex items-center justify-between">
      <button
        disabled={!available}
        onClick={() => {
          onApply?.(title);
          router.push("/careers/applyform");
        }}
        className="inline-flex items-center gap-2 rounded-full border border-gray-800 dark:border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-800 dark:text-gray-300 transition hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.apply}
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 dark:bg-gray-300 text-white dark:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      <span className="text-xs text-gray-400 dark:text-gray-500">{postedAt}</span>
    </div>
  </div>
);
}