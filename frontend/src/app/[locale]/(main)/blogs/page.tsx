import { HeroSection, BlogsPageWrapper } from "@/components/site-front/blogspage/index";

export default async function BlogsPageComponent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={locale} />
      <BlogsPageWrapper lang={locale} />
    </main>
  );
}
