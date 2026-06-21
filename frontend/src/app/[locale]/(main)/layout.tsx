// app/[locale]/(main)/layout.tsx
import Footer from '@/components/common/Footer/Footer';
import Navbar from '@/components/common/Navbar/Navbar';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  
  return (
    <>
      <Navbar />
      {children}
       <Footer locale={locale} />
    </>
  );
}