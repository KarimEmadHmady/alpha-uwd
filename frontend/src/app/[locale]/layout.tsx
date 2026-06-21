// app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ReduxProvider from '@/redux/ReduxProvider';
import { ToastProvider } from '@/context/ToastContext';
import '@/styles/scrollbar.css';

// ← امسح الـ font imports من هنا، موجودين في RootLayout

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // ← مفيش <html> أو <body> هنا
  return (
    <ReduxProvider>
      <ToastProvider>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </ToastProvider>
    </ReduxProvider>
  );
}