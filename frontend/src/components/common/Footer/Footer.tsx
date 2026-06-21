import Link from "next/link"
import Image from 'next/image';
import { Mail, Phone } from "lucide-react"

async function getFooterContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/footer?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const footer = data.content?.footer ?? null;
    
    if (!footer) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(footer)) {
      if (key.startsWith('logo') && key.endsWith('Image')) {
        // Image fields are strings, not multilingual
        result[key] = value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Extract language-specific content for multilingual fields
        const multilingualValue = value as { ar?: string; en?: string; [key: string]: string | undefined };
        result[key] = multilingualValue[lang] || multilingualValue.ar || multilingualValue.en || '';
      } else {
        result[key] = value;
      }
    }
    
    return result;
  } catch {
    return null;
  }
}

const FALLBACK = {
  description: 'Empowering individuals and businesses with expert financial planning, investment strategies, and data-driven insights.',
  importantLinksTitle: 'Important Links',
  homeLinkText: 'Home',
  aboutLinkText: 'About Us',
  servicesLinkText: 'Our Services',
  reportsLinkText: 'Financial Reports',
  contactLinkText: 'Contact',
  copyrightText: '© 2025 Alpha Asset Management. All rights reserved.',
  logoImage: '',
  aboutUsTitle: 'About Us',
  helloLinkText: 'Hello',
  corporateServicesLinkText: 'Corporate Services',
  institutionalInvestorsLinkText: 'Institutional Investors',
  ourTeamLinkText: 'Our Team',
  contactUsTitle: 'Contact Us',
  phoneNumber: '+2011234567890',
  emailAddress: 'info@alpha.com',
  contactFormLinkText: 'Contact Form',
  developedByText: 'Developed by',
  developedByUrl: 'https://uwd.dev/',
};

export default async function Footer({ locale }: { locale: string }) {
  const footer = await getFooterContent(locale) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
  return (
    <footer className="bg-[#00437A] text-white  rounded-t-[30px] " dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo Section */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="text-3xl font-bold mb-4">
              <Image
                src={footer.logoImage?.startsWith('http') ? footer.logoImage : (footer.logoImage ? `${BASE_URL}/${footer.logoImage}` : "/white-logo.png")}
                alt="Alpha Logo"
                width={140}
                height={45}
                className="me-3"
              />
            </div>
            <p className="text-sm text-gray-300 max-w-xs leading-relaxed">
              {footer.description}
            </p>
          </div>

          {/* Important Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-4 tracking-wide">{footer.importantLinksTitle}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.homeLinkText}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.aboutLinkText}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.servicesLinkText}
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.reportsLinkText}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.contactLinkText}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-4 tracking-wide">{footer.aboutUsTitle}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hello" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.helloLinkText}
                </Link>
              </li>
              <li>
                <Link href="/corporate-services" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.corporateServicesLinkText}
                </Link>
              </li>
              <li>
                <Link
                  href="/institutional-investors"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {footer.institutionalInvestorsLinkText}
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.ourTeamLinkText}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-4 tracking-wide">{footer.contactUsTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${footer.phoneNumber}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.phoneNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${footer.emailAddress}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {footer.emailAddress}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-300 hover:text-white transition-colors inline-block mt-2"
                >
                  {footer.contactFormLinkText}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800"></div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-400">{footer.copyrightText}</p>
          <div className="text-xs text-gray-400 mt-4 md:mt-0">
            <p className="text-xs text-gray-400">{footer.developedByText} <a href={footer.developedByUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">UWD</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
