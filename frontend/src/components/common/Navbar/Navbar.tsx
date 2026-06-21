'use client';
// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1];
    const basePath = pathname.replace(/^\/(en|ar)(?=\/|$)/, '');
    const t = useTranslations('Navigation');
    const isRTL = currentLocale === 'ar';
    const { theme, handleThemeChange } = useTheme();

    const toggleDropdown = (menu: string) => {
        setDropdownOpen(dropdownOpen === menu ? null : menu);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setDropdownOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        // Handle body overflow when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
return (
  <>
    {/* Blue Banner */}
    <div className="bg-[#00437A] text-white py-2">
      <div className="container px-6 mx-auto">
        <div className="flex justify-around items-center text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden md:inline">{t('address.full')}</span>
            <span className="md:hidden">{t('address.short')}</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{t('phone1')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{t('phone2')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.729 0 1.321-.592 1.321-1.324v-21.35c0-.733-.592-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <nav className="px-8 backdrop-blur-md bg-white dark:bg-[#1a1a1a] relative z-50 sticky top-0 border-b border-gray-100 dark:border-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center">

          {/* Top row - logo + hamburger */}
          <div className="flex items-center justify-between">
            <Link href="/" className="block lg:hidden">
              <Image className="w-auto h-6 sm:h-7" src="/logo.png" alt="" width={100} height={28} />
            </Link>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-[#00437A] focus:outline-none transition-colors"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 items-center justify-between">
            <Link href="/">
              <Image className="w-auto h-6 sm:h-7" src="/logo.png" alt="" width={100} height={28} />
            </Link>



            <div className="flex px-16 -mx-4 flex-row items-center capitalize">
             <Link href="/" className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium">{t('home')}</Link>

              {/* About Us Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => toggleDropdown('about')}
                  className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium flex items-center"
                >
                  {t('about')}
                  <svg className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'} transition-transform ${dropdownOpen === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen === 'about' && (
                  <div className={`absolute top-full mt-2 w-64 bg-white dark:bg-[#1a1a1a] shadow-lg rounded-lg z-[9999] border border-gray-200 dark:border-gray-700 ${isRTL ? 'right-0' : 'left-0'}`}>
                    <Link href="/about" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">{t('about')}</Link>
                    <Link href="/about/holdingcompany" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('holdingCompany')}</Link>
                    <Link href="/about/Committeessupportingboard" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('committees')}</Link>
                  </div>
                )}
              </div>

              {/* Services Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => toggleDropdown('services')}
                  className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium flex items-center"
                >
                  {t('services')}
                  <svg className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'} transition-transform ${dropdownOpen === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen === 'services' && (
                  <div className={`absolute top-full mt-2 w-64 bg-white dark:bg-[#1a1a1a] shadow-lg rounded-lg z-[9999] border border-gray-200 dark:border-gray-700 ${isRTL ? 'right-0' : 'left-0'}`}>
                    <Link href="/services" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('services')}</Link>
                    <Link href="/services/fundsmanagement" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('fundsManagement')}</Link>
                    <Link href="#" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('portfolioManagement')}</Link>
                    <Link href="#" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('cashManagement')}</Link>
                    <Link href="#" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('privatePension')}</Link>
                    <Link href="#" className="block px-4 py-3 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('familyBusiness')}</Link>
                  </div>
                )}
              </div>

              <Link href="/blogs" className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium">{t('blogs')}</Link>
              <Link href="/careers" className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium">{t('careers')}</Link>
              <Link href="/contact" className="transition-all duration-500 text-gray-500 dark:text-gray-400 transform mx-4 hover:-translate-y-0.5 hover:bg-[#00437a] hover:text-white px-3 py-1 rounded-full font-medium">{t('contact')}</Link>
            </div>
            <div className="flex items-center -mx-2">
              <div className="mx-2 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <Link href={currentLocale === 'en' ? `/ar${basePath}` : `/en${basePath}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLocale === 'en' ? 'bg-[#00437a] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                  En
                </Link>
                <Link href={currentLocale === 'ar' ? `/en${basePath}` : `/ar${basePath}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLocale === 'ar' ? 'bg-[#00437a] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                  Ar
                </Link>
              </div>
              <div className="mx-2 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button onClick={() => handleThemeChange('light')} className={`p-2 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-[#00437a] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`} aria-label="Light mode" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                <button onClick={() => handleThemeChange('dark')} className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#00437a] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`} aria-label="Dark mode" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Mobile Menu — fullscreen modern ── */}
          {isOpen && (
            <div className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[99999] flex flex-col bg-white dark:bg-[#1a1a1a] w-full h-screen animate-in fade-in slide-in-from-right duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
              
              {/* Mobile header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-[#1a1a1a] dark:to-gray-900 flex-shrink-0">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex-shrink-0">
                  <Image className="w-auto h-8" src="/logo.png" alt="Logo" width={100} height={32} />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-[#00437A] hover:text-white transition-all duration-200 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links — scrollable */}
              <div className="flex-1 flex flex-col gap-2 capitalize scrollbar-hide ">

                {/* About accordion */}
                <div className="dropdown-container">
                  <button
                    onClick={() => toggleDropdown('about')}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 ${dropdownOpen === 'about' ? 'bg-gradient-to-r from-[#00437A] to-[#005ba6] text-white shadow-lg' : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('about')}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen === 'about' && (
                    <div className={`${isRTL ? 'mr-4 border-r-2' : 'ml-4 border-l-2'} border-[#00437A] mt-2 flex flex-col gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg`}>
                      <Link href="/about" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('about')}</Link>
                      <Link href="/about/holdingcompany" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('holdingCompany')}</Link>
                      <Link href="#" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('committees')}</Link>
                    </div>
                  )}
                </div>

                {/* Services accordion */}
                <div className="dropdown-container">
                  <button
                    onClick={() => toggleDropdown('services')}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 ${dropdownOpen === 'services' ? 'bg-gradient-to-r from-[#00437A] to-[#005ba6] text-white shadow-lg' : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('services')}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen === 'services' && (
                    <div className={`${isRTL ? 'mr-4 border-r-2' : 'ml-4 border-l-2'} border-[#00437A] mt-2 flex flex-col gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg`}>
                      <Link href="/services/fundsmanagement" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('fundsManagement')}</Link>
                      <Link href="#" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('portfolioManagement')}</Link>
                      <Link href="#" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('cashManagement')}</Link>
                      <Link href="#" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('privatePension')}</Link>
                      <Link href="#" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00437A] dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-gray-800">{t('familyBusiness')}</Link>
                    </div>
                  )}
                </div>

                <Link href="/blogs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-base text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5a2 2 0 012-2h2.924a1 1 0 00.894-.553l.812-1.622a1 1 0 00-.894-1.447h-5.712a1 1 0 00-.894.553l-.812 1.622a1 1 0 00.894 1.447H19" />
                  </svg>
                  {t('blogs')}
                </Link>

                <Link href="/careers" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-base text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.934-8.763-2.645m16.02-4.986a23.52 23.52 0 003.7-3.75c-3.946 3.733-9.546 6-15.661 6C4.5 15 2.104 14.191.939 13.121m13.286-4.821a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {t('careers')}
                </Link>

                <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-base text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('contact')}
                </Link>
              </div>

              {/* Bottom bar — language + theme */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-[#1a1a1a] flex items-center justify-between gap-2 flex-shrink-0">
                {/* Language */}
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex-1">
                  <Link
                    href={currentLocale === 'en' ? `/ar${basePath}` : `/en${basePath}`}
                    className={`flex-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 text-center ${currentLocale === 'en' ? 'bg-[#00437a] text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    En
                  </Link>
                  <Link
                    href={currentLocale === 'ar' ? `/en${basePath}` : `/ar${basePath}`}
                    className={`flex-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 text-center ${currentLocale === 'ar' ? 'bg-[#00437a] text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    Ar
                  </Link>
                </div>

                {/* Theme */}
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-[#00437a] text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                    type="button"
                    aria-label="Light mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#00437a] text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                    type="button"
                    aria-label="Dark mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </nav>
  </>
);
}