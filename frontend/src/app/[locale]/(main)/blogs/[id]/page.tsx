import { BlogDetailPage , HeroSection} from "@/components/site-front/blogspage";

export default async function BlogDetailPageComponent({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={locale} />
      <BlogDetailPage lang={locale} blogId={id} />
    </main>
  );
}
