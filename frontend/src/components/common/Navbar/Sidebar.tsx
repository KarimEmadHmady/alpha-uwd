'use client';
// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFund } from '@/hooks/useFund';
import { useTheme } from '@/hooks/useTheme';

const locales = [
  {
    code: 'en',
    label: 'English'
  }, {
    code: 'ar',
    label: 'العربية'
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContentOpen, setPageContentOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const { funds, getAllFunds, getWaitingFunds } = useFund();
  const [waitingFunds, setWaitingFunds] = useState([]);
  const currentLocale = pathname.split('/')[1];
  const basePath = pathname.replace(/^\/(en|ar)(?=\/|$)/, '');
  const { theme, handleThemeChange } = useTheme();

  // Auto-open page content menu if current path is a page-content route
  useEffect(() => {
    if (pathname.includes('/dashboard/page-content')) {
      setPageContentOpen(true);
    }
  }, [pathname]);

  // Auto-open About submenu if current path is an about route
  useEffect(() => {
    if (pathname.includes('/dashboard/page-content/about')) {
      setAboutOpen(true);
    }
  }, [pathname]);

  // Auto-open Services submenu if current path is a services route
  useEffect(() => {
    if (pathname.includes('/dashboard/page-content/services')) {
      setServicesOpen(true);
    }
  }, [pathname]);

  // Auto-open Careers submenu if current path is a careers route
  useEffect(() => {
    if (pathname.includes('/dashboard/page-content/careers')) {
      setCareersOpen(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  // Check user role
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  useEffect(() => {
    if (isAuthenticated && (isAdmin || isManager)) {
      getAllFunds();
    }
  }, [isAuthenticated, isAdmin, isManager]);

  // Fetch waiting funds for notification
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isManager)) {
      const fetchWaitingFunds = async () => {
        try {
          const funds = await getWaitingFunds('en');
          setWaitingFunds(funds);
        } catch (error) {
          console.error('Error fetching waiting funds:', error);
        }
      };
      fetchWaitingFunds();
    }
  }, [isAuthenticated, isAdmin, isManager]);

  const toggleTheme = () => {
    handleThemeChange(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById('top-bar-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
      setIsOpen(!isOpen);
    }
  };
  console.log("User object:", user);
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-[#00437a]/80 shadow-lg">
        <div className="px-3 py-3 lg:px-5 lg:pl-3 bg-[#00437a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                type="button"
                className="sm:hidden text-white bg-transparent border-0 hover:bg-neutral-secondary-medium font-medium leading-5 rounded-base text-sm p-2 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <span className="sr-only">Open sidebar</span>
                <div className="relative w-6 h-5 flex flex-col justify-between items-center">
                  <span className={`block w-full h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : 'rotate-0 translate-y-0'}`}></span>
                  <span className={`block w-[70%] h-[1px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-full h-[1.5px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : 'rotate-0 translate-y-0'}`}></span>
                </div>
              </button>
              <Link href="/dashboard" className="flex ms-2 md:me-24">
                <Image
                  src="/white-logo.png"
                  alt="Alpha Logo"
                  width={80}
                  height={30}
                  className="me-3"
                />

                {/* <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Alpha</span> */}
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                <div>
                  <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-white/50" aria-expanded="false" data-dropdown-toggle="dropdown-user" onClick={() => {
                    const dropdown = document.getElementById('dropdown-user');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                      if (dropdown.classList.contains('hidden')) {
                        dropdown.classList.add('scale-95', 'opacity-0');
                        dropdown.classList.remove('scale-100', 'opacity-100');
                      } else {
                        dropdown.classList.remove('scale-95', 'opacity-0');
                        dropdown.classList.add('scale-100', 'opacity-100');
                      }
                    }
                  }}>
                    {/* <span className="sr-only">Open user menu</span> */}
                    <Image
                      src={user?.avatar || "/images-user.png"}
                      alt=""
                      width={28}
                      height={20}
                      className="rounded-full transition-all duration-300 hover:ring-2 hover:ring-white"
                    />
                  </button>
                </div>
                <div className="absolute top-full right-0 mt-2 z-50 hidden bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl w-auto transition-all duration-300" id="dropdown-user">
                  <div className="px-4 py-3 border-b border-gray-200" role="none">
                    <div className="flex items-start justify-betwee flex-col">
                      <div>
                        <p className="text-sm font-semibold text-gray-900" role="none">
                          {user?.username || 'User'}
                        </p>
                        <p className="text-sm text-gray-600 truncate" role="none">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-medium mt-1 ${user?.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        {user?.role || 'user'}
                      </span>
                    </div>
                  </div>
                  <ul className="p-2 text-sm text-gray-700 font-medium" role="none">

                    <li>
                      <Link href="/dashboard/user-profile" className="inline-flex items-center w-full p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:translate-x-1" role="menuitem">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Profile Settings
                      </Link>
                    </li>

                    <li>
                      <Link href="" className="inline-flex items-center w-full p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:translate-x-1" role="menuitem"
                        onClick={handleLogout}>

                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <button
                onClick={toggleTheme}
                className="ms-3 p-2 rounded-full transition-all duration-500 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-[#008dff] hover:text-white shadow"
                aria-label="Toggle dark mode"
                type="button"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                )}
              </button> */}
            </div>
          </div>
        </div>

      </nav>

      <aside id="top-bar-sidebar" className="fixed top-0 left-0 z-40 w-64 h-full transition-all duration-500 ease-in-out -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-1 py-4 overflow-y-auto bg-[#00437a] border-default">

          <ul className="space-y-4 font-medium mt-[60px]">

            {/* Admin Only Items */}
            {isAdmin && (
              <>
                <li>
                  <Link href="/dashboard" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                    <svg className="w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" /><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" /></svg>
                    <span className="ms-3 text-white">Dashboard</span>
                  </Link>
                </li>
                {/* Page Content - Collapsible Menu */}
                <li>
                  <button
                    type="button"
                    onClick={() => setPageContentOpen(!pageContentOpen)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl"
                  >
                    <div className="flex items-center">
                      <svg
                        className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V8.5C20 9.32843 19.3284 10 18.5 10H5.5C4.67157 10 4 9.32843 4 8.5V6.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 15.5C4 14.6716 4.67157 14 5.5 14H13.5C14.3284 14 15 14.6716 15 15.5V17.5C15 18.3284 14.3284 19 13.5 19H5.5C4.67157 19 4 18.3284 4 17.5V15.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap text-white">
                        Page Content
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        pageContentOpen ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  {/* Submenu */}
                  {pageContentOpen && (
                    <ul className="ms-8 mt-2 space-y-1">
                      <li>
                        <Link
                          href="/dashboard/page-content/home"
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                            pathname.includes('/dashboard/page-content/home')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <span className="ms-3">Home</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => setAboutOpen(!aboutOpen)}
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm w-full text-left ${
                            pathname.includes('/dashboard/page-content/about')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <svg className={`w-4 h-4 me-2 transition-transform ${aboutOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="ms-1">About</span>
                        </button>
                        {/* About Submenu */}
                        {aboutOpen && (
                          <ul className="ms-8 mt-2 space-y-1">
                            <li>
                              <Link
                                href="/dashboard/page-content/about"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname === '/dashboard/page-content/about'
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">About Page</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/dashboard/page-content/about/committee"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname.includes('/dashboard/page-content/about/committee')
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">Committee</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/dashboard/page-content/about/holdingcompany"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname.includes('/dashboard/page-content/about/holdingcompany')
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">holdingcompany</span>
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                       <li>
                        <button
                          onClick={() => setServicesOpen(!servicesOpen)}
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm w-full text-left ${
                            pathname.includes('/dashboard/page-content/services')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <svg className={`w-4 h-4 me-2 transition-transform ${servicesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="ms-1">Services</span>
                        </button>
                        {/* Services Submenu */}
                        {servicesOpen && (
                          <ul className="ms-8 mt-2 space-y-1">
                            <li>
                              <Link
                                href="/dashboard/page-content/services"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname === '/dashboard/page-content/services'
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">Services Main</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/dashboard/page-content/services/fundsmanagement"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname.includes('/dashboard/page-content/services/fundsmanagement')
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">Funds Management</span>
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li>
                        <button
                          onClick={() => setCareersOpen(!careersOpen)}
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm w-full text-left ${
                            pathname.includes('/dashboard/page-content/careers')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <svg className={`w-4 h-4 me-2 transition-transform ${careersOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="ms-1">Careers</span>
                        </button>
                        {/* Careers Submenu */}
                        {careersOpen && (
                          <ul className="ms-8 mt-2 space-y-1">
                            <li>
                              <Link
                                href="/dashboard/page-content/careers"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname === '/dashboard/page-content/careers'
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">Careers</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/dashboard/page-content/careers/applications"
                                className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                                  pathname.includes('/dashboard/page-content/careers/applications')
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80'
                                }`}
                              >
                                <span className="ms-3">Applications</span>
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      
                      
                      <li>
                        <Link
                          href="/dashboard/page-content/blogs"
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                            pathname.includes('/dashboard/page-content/blogs')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <span className="ms-3">Blogs</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard/page-content/contact"
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                            pathname.includes('/dashboard/page-content/contact')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <span className="ms-3">Contact</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard/page-content/footer"
                          className={`flex items-center px-2 py-1.5 rounded-base hover:bg-white/20 hover:text-white group transition-all duration-300 text-sm ${
                            pathname.includes('/dashboard/page-content/footer')
                              ? 'text-white bg-white/20'
                              : 'text-white/80'
                          }`}
                        >
                          <span className="ms-3">Footer</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link href="/dashboard/funds" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                    <svg className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8" /></svg>
                    <span className="flex-1 ms-3 whitespace-nowrap text-white">All funds</span>
                    <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-white bg-white/20 border border-white/30 rounded-full">{Array.isArray(funds) ? funds.length : 0}</span>
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/waiting-approve" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                    {/* Approved / Check */}
                    <svg className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]"
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l1.8 1.8L15 10" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap text-white">Fund waiting approve</span>
                    {waitingFunds.length > 0 && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/add-fund" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                    <svg className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" /></svg>
                    <span className="flex-1 ms-3 whitespace-nowrap text-white">Add funds</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/category" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                    <svg className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]"
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41 10.59 3.41a2 2 0 0 0-2.83 0L3.41 8.76a2 2 0 0 0 0 2.83l10 10a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
                      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
                    </svg>                <span className="flex-1 ms-3 whitespace-nowrap text-white">Categories </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl"
                  >
                    <svg
                      className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap text-white">
                      Users
                    </span>
                  </Link>
                </li>

              </>
            )}

            {/* Manager Only Items */}
            {isManager && (
              <li>
                <Link href="/dashboard/funds-manager" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl">
                  <svg className="shrink-0 w-5 h-5 text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8" /></svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-white">funds</span>
                  <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-white bg-white/20 border border-white/30 rounded-full">{Array.isArray(funds) ? funds.length : 0}</span>
                </Link>
              </li>
            )}
            {/* Logout - Always Show for Authenticated Users */}
            {isAuthenticated && (
              <li>
                <Link href="" className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/20 hover:scale-102 group transition-all duration-300 transform hover:translate-x-2 w-[95%] rounded-xl" onClick={handleLogout}>
                  <svg className="shrink-0 w-5 h-5 text-red-500 transition duration-300 group-hover:scale-110" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" /></svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-red-500">Logout</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>


    </>
  );
}
