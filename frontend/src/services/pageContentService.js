const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const pageContentService = {
  /**
   * Public read-only: get content for a page
   * GET /api/page-content/:page
   */
  async getPageContent(page) {
    const response = await fetch(`${API_URL}/api/page-content/${page}?lang=all`,  {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch page content";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  /**
   * Admin-only: update (upsert) content for a page
   * PUT /api/page-content/:page
   */
async updatePageContent(page, content, token, images = {}) {
  if (!token) throw new Error("Token is required for updating page content");

  const formData = new FormData();
  
  // أضف الـ content كـ JSON string
  formData.append("content", JSON.stringify(content));
  
  // أضف الصور لو فيه
Object.entries(images).forEach(([key, file]) => {
  if (file) formData.append(key, file);
});

  const response = await fetch(`${API_URL}/api/page-content/${page}`, {
    method: "PUT",
    headers: {
      // مش بنبعت Content-Type — المتصفح بيحددها تلقائي مع FormData
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to update page content";
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return await response.json();
},
};


