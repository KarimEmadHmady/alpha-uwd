// src/services/email.service.js
import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "mail.uwd.agency",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const EmailService = {
  async sendFundDeclinedEmail(username, email, fundname, date, message) {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .email-header .icon {
            font-size: 60px;
            margin-bottom: 15px;
          }
          .email-body {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .fund-info {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .fund-info h3 {
            color: #991b1b;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .fund-name {
            font-size: 20px;
            color: #1f2937;
            font-weight: bold;
            margin: 10px 0;
          }
          .message-box {
            background-color: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
          }
          .message-box h3 {
            color: #374151;
            margin: 0 0 15px 0;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .message-content {
            color: #1f2937;
            line-height: 1.8;
            font-size: 15px;
            white-space: pre-wrap;
          }
          .next-steps {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .next-steps h3 {
            color: #1e40af;
            margin: 0 0 15px 0;
            font-size: 16px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
            color: #1f2937;
            line-height: 1.8;
          }
          .next-steps li {
            margin: 8px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
            transform: translateY(-2px);
          }
          .email-footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-info {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.6;
            margin: 10px 0;
          }
          .date-stamp {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .support-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
          }
          .support-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="email-header">
            <div class="icon">⚠️</div>
            <h1>Fund Status Update</h1>
          </div>

          <!-- Body -->
          <div class="email-body">
            <p class="greeting">Hello <strong>${username}</strong>,</p>
            
            <p style="color: #4b5563; line-height: 1.8; margin-bottom: 20px;">
              We wanted to inform you that your fund has been reviewed, and unfortunately, it has <strong style="color: #dc2626;">not been approved</strong> at this time.
            </p>

            <!-- Fund Info -->
            <div class="fund-info">
              <h3>📋 Fund Information</h3>
              <div class="fund-name">${fundname}</div>
            </div>

            <!-- Decline Message -->
            <div class="message-box">
              <h3>
                <span style="font-size: 20px;">💬</span>
                Reason for Decline
              </h3>
              <div class="message-content">${message || 'No specific reason provided.'}</div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
              <h3>📌 Next Steps</h3>
              <ul>
                <li>Carefully review the reason for decline mentioned above</li>
                <li>Update the required data and documents</li>
                <li>Resubmit your fund after making the necessary modifications</li>
                <li>Contact our support team if you have any questions</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/funds-manager" class="cta-button">
                Go to Dashboard
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div class="email-footer">
            <p class="footer-info">
              If you have any questions or need assistance, please contact us at:
              <br>
              <a href="mailto:${process.env.EMAIL_USER}" class="support-link">${process.env.EMAIL_USER}</a>
            </p>
            
            <p class="footer-info">
              We're here to help you improve your fund and ensure it meets all requirements.
            </p>

            <div class="date-stamp">
              📅 Sent on: ${date}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      to: email,
      from: `"Alpha Capital" <${process.env.EMAIL_USER}>`,
      subject: `⚠️ Fund Not Approved - ${fundname}`,
      html: htmlContent
    });
  },

  async sendFundApprovedEmail(username, email, fundname, date) {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .email-header .icon {
            font-size: 60px;
            margin-bottom: 15px;
          }
          .email-body {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .fund-info {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .fund-name {
            font-size: 20px;
            color: #1f2937;
            font-weight: bold;
            margin: 10px 0;
          }
          .success-message {
            background-color: #ecfdf5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .success-message p {
            color: #065f46;
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
          }
          .cta-button:hover {
            box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
            transform: translateY(-2px);
          }
          .email-footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-info {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.6;
            margin: 10px 0;
          }
          .date-stamp {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="icon">🎉</div>
            <h1>Congratulations! Fund Approved</h1>
          </div>

          <div class="email-body">
            <p class="greeting">Hello <strong>${username}</strong>,</p>
            
            <p style="color: #4b5563; line-height: 1.8;">
              We're excited to inform you that your fund has been <strong style="color: #059669;">approved and published successfully</strong>! 🎊
            </p>

            <div class="fund-info">
              <h3 style="color: #065f46; margin: 0 0 10px 0;">📋 Fund Information</h3>
              <div class="fund-name">${fundname}</div>
            </div>

            <div class="success-message">
              <p><strong>✅ Your fund is now live!</strong></p>
              <p>Investors can now view and invest in your fund through our platform.</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/funds-manager" class="cta-button">
                View Your Fund
              </a>
            </div>
          </div>

          <div class="email-footer">
            <p class="footer-info">
              Thank you for choosing Alpha Capital. We wish you success with your fund!
            </p>
            <div class="date-stamp">📅 ${date}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      to: email,
      from: `"Alpha Capital" <${process.env.EMAIL_USER}>`,
      subject: `🎉 Fund Approved - ${fundname}`,
      html: htmlContent
    });
  }
};