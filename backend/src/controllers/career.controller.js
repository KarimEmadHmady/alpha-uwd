import { CareerService } from "../services/career.service.js";

export class CareerController {
  /**
   * POST /alpha/api/careers/apply
   * Public endpoint to submit job application
   */
  static async submitApplication(req, res) {
    try {
      const { name, email, phone, jobName } = req.body;

      // Validation
      if (!name || !email || !phone || !jobName) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields: name, email, phone, jobName",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: 0,
          message: "Invalid email format",
        });
      }

      // Get CV filename if uploaded
      const cvFilename = req.file ? `uploads/documents/${req.file.filename}` : null;

      // Prepare application data
      const applicationData = {
        name,
        email,
        phone,
        jobName,
        cv: cvFilename,
        submittedAt: new Date().toISOString(),
      };

      // Submit application
      const result = await CareerService.submitApplication(applicationData);

      return res.status(200).json({
        success: 1,
        message: "Application submitted successfully",
        data: applicationData,
      });
    } catch (err) {
      console.error("Error submitting application:", err);
      return res.status(500).json({
        success: 0,
        message: "Failed to submit application",
        error: err.message,
      });
    }
  }
}
