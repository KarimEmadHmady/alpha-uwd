/**
 * Frontend Example: Page Content with Images Upload
 * استخدام API محتوى الصفحة مع رفع الصور
 */

// ==========================================
// مثال 1: استخدام Fetch API مع FormData
// ==========================================

async function updatePageContentWithImages(pageName, contentObj, imageFiles) {
  const formData = new FormData();

  // إضافة المحتوى كـ JSON string
  formData.append("content", JSON.stringify(contentObj));

  // إضافة الصور
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("images", file); // ملف واحد من نوع File
    });
  }

  try {
    const response = await fetch(
      `/alpha/api/page-content/${pageName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Note: لا تضيف Content-Type header - سيتم تعيينها تلقائياً من قبل FormData
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update page content");
    }

    const result = await response.json();
    console.log("Success:", result);
    
    // المسارات المرفوعة متاحة الآن في:
    // result.uploadedImages[].path
    
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// ==========================================
// مثال 2: استخدام مع React
// ==========================================

import React, { useState } from "react";

function PageContentForm() {
  const [content, setContent] = useState({
    hero: {
      title: { ar: "العنوان", en: "Title" },
      description: { ar: "الوصف", en: "Description" },
      backgroundImage: "",
    },
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", JSON.stringify(content));

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/alpha/api/page-content/home", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setUploadedImages(result.uploadedImages || []);
      alert("تم تحديث المحتوى بنجاح!");
    } catch (error) {
      alert("خطأ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => handleContentChange(JSON.parse(e.target.value))}
        style={{ width: "100%", height: "300px" }}
      />

      <input type="file" multiple onChange={handleImageSelect} accept="image/*" />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "جاري الرفع..." : "حفظ المحتوى والصور"}
      </button>

      {uploadedImages.length > 0 && (
        <div>
          <h3>الصور المرفوعة:</h3>
          <ul>
            {uploadedImages.map((img, idx) => (
              <li key={idx}>
                <strong>{img.originalName}</strong>
                <p>المسار: {img.path}</p>
                <p>الحجم: {(img.size / 1024).toFixed(2)} KB</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PageContentForm;

// ==========================================
// مثال 3: استخدام مع jQuery (إذا كان موجود)
// ==========================================

function updatePageContentJQuery(pageName, contentObj, fileInputId) {
  const formData = new FormData();
  formData.append("content", JSON.stringify(contentObj));

  // الحصول على الملفات من input
  const files = document.getElementById(fileInputId).files;
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  $.ajax({
    url: `/alpha/api/page-content/${pageName}`,
    type: "PUT",
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      console.log("Success:", response);
      if (response.uploadedImages) {
        response.uploadedImages.forEach((img) => {
          console.log("Uploaded:", img.path);
        });
      }
    },
    error: function (xhr) {
      console.error("Error:", xhr.responseJSON);
    },
  });
}

// ==========================================
// مثال 4: الحصول على محتوى الصفحة
// ==========================================

async function getPageContent(pageName, language = null) {
  let url = `/alpha/api/page-content/${pageName}`;
  if (language) {
    url += `?lang=${language}`; // 'ar' أو 'en'
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch page content");

    const result = await response.json();
    return result.content; // محتوى الصفحة
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// الاستخدام:
// const arContent = await getPageContent("home", "ar");
// const enContent = await getPageContent("home", "en");
// const allContent = await getPageContent("home");

// ==========================================
// مثال 5: عرض صورة مرفوعة
// ==========================================

async function displayPageContent(pageName, language = "ar") {
  try {
    const content = await getPageContent(pageName, language);

    // عرض الخلفية
    if (content.hero && content.hero.backgroundImage) {
      document.getElementById("hero-section").style.backgroundImage =
        `url('${content.hero.backgroundImage}')`;
    }

    // عرض العنوان
    if (content.hero && content.hero.title) {
      document.getElementById("title").textContent = content.hero.title;
    }

    // عرض الأقسام مع الصور
    if (content.sections && Array.isArray(content.sections)) {
      const container = document.getElementById("sections");
      container.innerHTML = "";

      content.sections.forEach((section) => {
        const div = document.createElement("div");
        div.className = "section";

        if (section.image) {
          const img = document.createElement("img");
          img.src = section.image;
          img.alt = section.name || "Section image";
          div.appendChild(img);
        }

        if (section.name) {
          const h2 = document.createElement("h2");
          h2.textContent = section.name;
          div.appendChild(h2);
        }

        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error("Error displaying page:", error);
  }
}

// الاستخدام:
// displayPageContent("home", "ar");
