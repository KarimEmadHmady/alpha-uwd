import { PageContentService } from "./page-content.service.js";

export class CareerService {
  /**
   * Submit a job application
   * @param {object} applicationData - {name, email, phone, jobName, cv, submittedAt}
   */
  static async submitApplication(applicationData) {
    try {
      // Get current careers content
      let currentResult = await PageContentService.getPageContent("careers");
      
      // Initialize content structure if needed
      let currentContent = currentResult?.content || {};
      
      // Ensure applications array exists
      if (!Array.isArray(currentContent.applications)) {
        currentContent.applications = [];
      }

      // Add new application
      currentContent.applications.push(applicationData);

      // Save back to database
      const result = await PageContentService.updatePageContent(
        "careers",
        currentContent
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
