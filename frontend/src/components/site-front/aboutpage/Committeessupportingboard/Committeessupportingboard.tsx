'use client';

import Image from 'next/image';
import { useState } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const CENTRAL_RISK_COMMITTEE = [
  {
    img: '/board/ahmed-darwish.jpg',
    name: 'DR. Ahmed Darwish',
    title: 'Managing Director Funds & Portfolios Management',
  },
  {
    img: '/board/rania-essam.jpg',
    name: 'MS. Rania Essam',
    title: 'Board Members',
  },
  {
    img: '/board/mohamed-hassan.jpg',
    name: 'MR. Mohamed Hassan',
    title: 'Managing Director - Specialized Investment Funds',
  },
  {
    img: '/board/ahmed-shehata.jpg',
    name: 'DR. Ahmed Shehata',
    title: 'Managing Director REITs & Private Equity Funds',
  },
  {
    img: '/board/heba-zaghoul.jpg',
    name: 'ENG. Heba Saad Zaghoul',
    title: 'Board Members',
  },
  {
    img: '/board/ashraf-elaraby.jpg',
    name: 'DR. Ashraf El-Araby',
    title: 'Board Members',
  },
];

const AUDIT_AND_GOVERNANCE_COMMITTEE = [
  {
    img: '/board/ashraf-elaraby.jpg',
    name: 'DR. Ashraf El-Araby',
    title: 'Committee Chairman',
  },
  {
    img: '/board/heba-zaghoul.jpg',
    name: 'ENG. Heba Saad Zaghoul',
    title: 'Board Members',
  },
  {
    img: '/board/rania-essam.jpg',
    name: 'MS. Rania Essam',
    title: 'Board Members',
  },
  {
    img: '/board/ahmed-shehata.jpg',
    name: 'DR. Ahmed Shehata',
    title: 'Managing Director REITs & Private Equity Funds',
  },
  {
    img: '/board/ahmed-darwish.jpg',
    name: 'DR. Ahmed Darwish',
    title: 'Managing Director Funds & Portfolios Management',
  },
  {
    img: '/board/mohamed-hassan.jpg',
    name: 'MR. Mohamed Hassan',
    title: 'Managing Director - Specialized Investment Funds',
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type TabKey = 'risk' | 'audit';

interface Tab {
  key: TabKey;
  label: string;
}

// ── Member Card ───────────────────────────────────────────────────────────────

interface MemberCardProps {
  img: string;
  name: string;
  title: string;
  index: number;
}

function MemberCard({ img, name, title, index }: MemberCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={img}
          alt={name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-[#00437A] transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-snug">{title}</p>

        {/* Divider + social */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            {/* LinkedIn */}
            <a
              href="#"
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#00437A] hover:text-[#00437A] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
              </svg>
            </a>
            {/* Email */}
            <a
              href="#"
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#00437A] hover:text-[#00437A] transition-colors"
              aria-label="Email"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
          <span className="text-xs text-gray-300">#{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface CommitteesSupportingBoardProps {
  data: any;
  BASE_URL: string;
  lang?: string;
}

export default function CommitteesSupportingBoard({ data, BASE_URL, lang }: CommitteesSupportingBoardProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';
  const [activeTab, setActiveTab] = useState<TabKey>('risk');

  // Build members from dynamic data
  const CENTRAL_RISK_COMMITTEE = [
    {
      img: safeData.centralRiskMember1Image || '/board/ahmed-darwish.jpg',
      name: safeData.centralRiskMember1Name || 'DR. Ahmed Darwish',
      title: safeData.centralRiskMember1Title || 'Managing Director Funds & Portfolios Management',
    },
    {
      img: safeData.centralRiskMember2Image || '/board/rania-essam.jpg',
      name: safeData.centralRiskMember2Name || 'MS. Rania Essam',
      title: safeData.centralRiskMember2Title || 'Board Members',
    },
    {
      img: safeData.centralRiskMember3Image || '/board/mohamed-hassan.jpg',
      name: safeData.centralRiskMember3Name || 'MR. Mohamed Hassan',
      title: safeData.centralRiskMember3Title || 'Managing Director - Specialized Investment Funds',
    },
    {
      img: safeData.centralRiskMember4Image || '/board/ahmed-shehata.jpg',
      name: safeData.centralRiskMember4Name || 'DR. Ahmed Shehata',
      title: safeData.centralRiskMember4Title || 'Managing Director REITs & Private Equity Funds',
    },
    {
      img: safeData.centralRiskMember5Image || '/board/heba-zaghoul.jpg',
      name: safeData.centralRiskMember5Name || 'ENG. Heba Saad Zaghoul',
      title: safeData.centralRiskMember5Title || 'Board Members',
    },
    {
      img: safeData.centralRiskMember6Image || '/board/ashraf-elaraby.jpg',
      name: safeData.centralRiskMember6Name || 'DR. Ashraf El-Araby',
      title: safeData.centralRiskMember6Title || 'Board Members',
    },
  ];

  const AUDIT_AND_GOVERNANCE_COMMITTEE = [
    {
      img: safeData.auditMember1Image || '/board/ashraf-elaraby.jpg',
      name: safeData.auditMember1Name || 'DR. Ashraf El-Araby',
      title: safeData.auditMember1Title || 'Committee Chairman',
    },
    {
      img: safeData.auditMember2Image || '/board/heba-zaghoul.jpg',
      name: safeData.auditMember2Name || 'ENG. Heba Saad Zaghoul',
      title: safeData.auditMember2Title || 'Board Members',
    },
    {
      img: safeData.auditMember3Image || '/board/rania-essam.jpg',
      name: safeData.auditMember3Name || 'MS. Rania Essam',
      title: safeData.auditMember3Title || 'Board Members',
    },
    {
      img: safeData.auditMember4Image || '/board/ahmed-shehata.jpg',
      name: safeData.auditMember4Name || 'DR. Ahmed Shehata',
      title: safeData.auditMember4Title || 'Managing Director REITs & Private Equity Funds',
    },
    {
      img: safeData.auditMember5Image || '/board/ahmed-darwish.jpg',
      name: safeData.auditMember5Name || 'DR. Ahmed Darwish',
      title: safeData.auditMember5Title || 'Managing Director Funds & Portfolios Management',
    },
    {
      img: safeData.auditMember6Image || '/board/mohamed-hassan.jpg',
      name: safeData.auditMember6Name || 'MR. Mohamed Hassan',
      title: safeData.auditMember6Title || 'Managing Director - Specialized Investment Funds',
    },
  ];

  const TABS: Tab[] = [
    { key: 'risk', label: safeData.centralRiskTabLabel || 'Central Risk Committee' },
    { key: 'audit', label: safeData.auditTabLabel || 'Central Committee For Audit And Governance' },
  ];

  const members =
    activeTab === 'risk' ? CENTRAL_RISK_COMMITTEE : AUDIT_AND_GOVERNANCE_COMMITTEE;

return (
    <section className="py-20 bg-white dark:bg-[#1a1a1a]" dir={safeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">
            {safeData.title || 'Committees Supporting The Board Of Directors'}
          </h2>

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer
                  ${
                    activeTab === tab.key
                      ? 'bg-[#00437A] text-white border-[#00437A] shadow-sm'
                      : 'bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-[#00437A] hover:text-[#00437A] dark:hover:border-[#00437A] dark:hover:text-[#00437A]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid — animates on tab switch via key prop */}
        <div
          key={activeTab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
        >
          {members.map((member, i) => (
            <MemberCard key={i} {...member} index={i} />
          ))}
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}