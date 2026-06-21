"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface ApplyNowProps {
  lang?: string;
}

const translations = {
  en: {
    applyTitle: "Apply Now",
    applyDesc: "Join A Team Of Visionaries, And Financial Experts Dedicated To Democratizing Wealth Management Through Technology",
    namePlaceholder: "Your Name",
    emailPlaceholder: "E-Mail",
    phonePlaceholder: "Phone Number",
    jobPlaceholder: "Job Name",
    uploadCV: "Upload Your C.V",
    sendBtn: "Send",
    successTitle: "Thank You!",
    successMsg: "Your Application Has Been Submitted Successfully!",
    successDesc: "We'll Contact You",
    backHome: "Back To Home",
  },
  ar: {
    applyTitle: "قدم الآن",
    applyDesc: "انضم إلى فريق من الرؤى والخبراء الماليين المكرسين لتحديث إدارة الثروات من خلال التكنولوجيا",
    namePlaceholder: "اسمك",
    emailPlaceholder: "البريد الإلكتروني",
    phonePlaceholder: "رقم الهاتف",
    jobPlaceholder: "اسم الوظيفة",
    uploadCV: "حمل سيرتك الذاتية",
    sendBtn: "إرسال",
    successTitle: "شكراً لك!",
    successMsg: "تم تقديم طلبك بنجاح!",
    successDesc: "سنتواصل معك قريباً",
    backHome: "العودة للرئيسية",
  },
};

export default function ApplyNow({ lang = "en" }: ApplyNowProps) {
  const isArabic = lang === "ar";
  const t = translations[lang as keyof typeof translations] || translations.en;

  const [fileName, setFileName] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobName: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async () => {
    setError("");
    
    // Validation
    if (!form.name || !form.email || !form.phone || !form.jobName) {
      setError(isArabic ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare FormData with application data
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("jobName", form.jobName);
      
      // Add CV file if uploaded
      if (fileInputRef.current?.files?.[0]) {
        formData.append("cv", fileInputRef.current.files[0]);
      }

      // Send application to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careers/apply`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      // Reset form
      setForm({ name: "", email: "", phone: "", jobName: "" });
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowModal(true);
    } catch (err) {
      setError(isArabic ? "حدث خطأ في الإرسال" : "Error submitting application");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center px-6 py-16`} dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Form */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3 tracking-tight">
            {t.applyTitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {t.applyDesc}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder={t.namePlaceholder}
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-5 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-[#1a1a1a] outline-none focus:border-[#00437A] focus:ring-1 focus:ring-[#00437A] transition"
            />
            <input
              type="email"
              name="email"
              placeholder={t.emailPlaceholder}
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-5 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-[#1a1a1a] outline-none focus:border-[#00437A] focus:ring-1 focus:ring-[#00437A] transition"
            />
            <input
              type="tel"
              name="phone"
              placeholder={t.phonePlaceholder}
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-5 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-[#1a1a1a] outline-none focus:border-[#00437A] focus:ring-1 focus:ring-[#00437A] transition"
            />
            <input
              type="text"
              name="jobName"
              placeholder={t.jobPlaceholder}
              value={form.jobName}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-5 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-[#1a1a1a] outline-none focus:border-[#00437A] focus:ring-1 focus:ring-[#00437A] transition"
            />

            {/* Upload CV */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-5 py-5 flex items-start gap-3 cursor-pointer hover:border-[#00437A] dark:hover:border-[#00437A] transition"
            >
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-600 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-sm text-gray-400 dark:text-gray-600 truncate">
                {fileName ? fileName : t.uploadCV}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-3 bg-[#00437A] hover:bg-[#003060] disabled:bg-gray-400 text-white text-sm font-medium px-6 py-3 rounded-full transition"
              >
                {loading ? "..." : t.sendBtn}
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className={`w-3.5 h-3.5 text-white ${isArabic ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative w-full h-[460px] rounded-3xl overflow-hidden">
          <Image
            src="/apply-image.jpg"
            alt="Team collaborating"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* ===================== SUCCESS MODAL ===================== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 px-10 py-12 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Badge checkmark icon */}
            <div className="mb-6">
              <svg
                className="w-24 h-24"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 5l5.88 8.76 10.24-2.78-1.06 10.56 9.38 4.8-5.88 8.76 5.88 8.76-9.38 4.8 1.06 10.56-10.24-2.78L40 65l-5.88-8.56-10.24 2.78 1.06-10.56-9.38-4.8 5.88-8.76-5.88-8.76 9.38-4.8-1.06-10.56 10.24 2.78L40 5z"
                  fill="#00437A"
                />
                <path
                  d="M27 40l9 9 17-17"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-[#00437A] mb-2">
              {t.successTitle}
            </h3>
            <p className="text-gray-800 dark:text-gray-50 text-sm font-semibold mb-1">
              {t.successMsg}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">{t.successDesc}</p>

            <Link
              href={isArabic ? "/ar" : "/en"}
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-6 py-2.5 text-sm font-medium hover:border-[#00437A] hover:text-[#00437A] dark:hover:border-[#00437A] dark:hover:text-blue-400 transition"
            >
              {t.backHome}
              <span className={`w-6 h-6 rounded-full bg-[#00437A] flex items-center justify-center ${isArabic ? "rotate-180" : ""}`}>
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
