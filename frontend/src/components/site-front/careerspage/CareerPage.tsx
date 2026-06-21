"use client";

import { useState, useEffect } from "react";
import CareerHero from "./Careerhero";
import JobCard from "./Jobcard";
import HeroSection from "./HeroSection";
import { pageContentService } from "@/services/pageContentService";

interface Job {
  id: string | number;
  title: Record<string, string>;
  description: Record<string, string>;
  category: Record<string, string>;
  available: boolean;
  postedAt: Record<string, string>;
}

interface CareersPageProps {
  lang: string;
}

export default function CareersPage({ lang = "en" }: CareersPageProps) {
  const isArabic = lang === "ar";
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<{ hero: Record<string, any>; jobs: Job[] }>({ hero: {}, jobs: [] });

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await pageContentService.getPageContent('careers').catch(() => null);
        if (response && response.content) {
          setContent(response.content);
        }
      } catch (err) {
        console.error('Failed to load careers content:', err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div></div>;
  }

  function handleApply(jobTitle: string) {
    console.log(`Applied for: ${jobTitle}`);
  }

  return (
    <>
      <HeroSection lang={lang} content={content.hero} />
      <div className="max-w-6xl mx-auto py-10" dir={isArabic ? "rtl" : "ltr"}>
        <CareerHero applyUrl="/careers/applyform" lang={lang} content={content.hero} />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {content.jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title[isArabic ? "ar" : "en"] || ""}
              description={job.description[isArabic ? "ar" : "en"] || ""}
              category={job.category[isArabic ? "ar" : "en"] || ""}
              available={job.available}
              postedAt={job.postedAt[isArabic ? "ar" : "en"] || ""}
              onApply={handleApply}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </>
  );
}