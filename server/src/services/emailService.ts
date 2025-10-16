import nodemailer from 'nodemailer';
import { logger } from '../config/logger';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email options interface
interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
}

// Email service class
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig;

  constructor() {
    // Get configuration from environment variables
    this.config = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    };

    this.initializeTransporter();
  }

  // Initialize nodemailer transporter
  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport(this.config);
      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
    }
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      logger.error('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }

  // Send a single email
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.error('Email transporter not initialized');
      return false;
    }

    // Validate email configuration
    if (!this.config.auth.user || !this.config.auth.pass) {
      logger.warn('Email credentials not configured. Skipping email send.');
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'BharatNet CRM'}" <${this.config.auth.user}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  // Send welcome email to new customer
  async sendWelcomeEmail(to: string, customerName: string): Promise<boolean> {
    const subject = 'Welcome to BharatNet CRM!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to BharatNet CRM! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Thank you for joining BharatNet CRM! We're excited to have you on board.</p>
            <p>Our team is dedicated to providing you with the best service experience. If you have any questions or need assistance, please don't hesitate to reach out.</p>
            <p>Here's what you can expect:</p>
            <ul>
              <li>Personalized customer support</li>
              <li>Regular updates on your account</li>
              <li>Access to exclusive features</li>
              <li>24/7 assistance when you need it</li>
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Visit Dashboard</a>
            </p>
            <p>Best regards,<br><strong>The BharatNet CRM Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 BharatNet CRM. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  // Send follow-up email
  async sendFollowUpEmail(
    to: string,
    customerName: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Follow-up from BharatNet CRM</h2>
          </div>
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <div class="message">
              ${message}
            </div>
            <p>If you have any questions or need further assistance, please feel free to reply to this email.</p>
            <p>Best regards,<br><strong>The BharatNet CRM Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 BharatNet CRM. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  // Send invoice email
  async sendInvoiceEmail(
    to: string,
    customerName: string,
    invoiceNumber: string,
    amount: number,
    dueDate: string
  ): Promise<boolean> {
    const subject = `Invoice #${invoiceNumber} from BharatNet CRM`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .invoice-box { background: white; padding: 20px; border: 2px solid #667eea; margin: 20px 0; border-radius: 5px; }
          .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .invoice-total { font-size: 20px; font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Invoice #${invoiceNumber}</h2>
          </div>
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Please find your invoice details below:</p>
            <div class="invoice-box">
              <div class="invoice-row">
                <span>Invoice Number:</span>
                <strong>${invoiceNumber}</strong>
              </div>
              <div class="invoice-row">
                <span>Amount Due:</span>
                <span class="invoice-total">₹${amount.toLocaleString('en-IN')}</span>
              </div>
              <div class="invoice-row">
                <span>Due Date:</span>
                <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong>
              </div>
            </div>
            <p>Please make the payment by the due date to avoid any service interruption.</p>
            <p>If you have any questions about this invoice, please contact us.</p>
            <p>Best regards,<br><strong>The BharatNet CRM Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 BharatNet CRM. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  // Send bulk emails with delay between each
  async sendBulkEmails(
    recipients: Array<{ email: string; name: string }>,
    subject: string,
    getHtmlContent: (name: string) => string,
    delayMs: number = 1000
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const html = getHtmlContent(recipient.name);
      const sent = await this.sendEmail({
        to: recipient.email,
        subject,
        html,
      });

      if (sent) {
        success++;
      } else {
        failed++;
      }

      // Delay between emails to avoid rate limiting
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    logger.info(`Bulk email completed: ${success} sent, ${failed} failed`);
    return { success, failed };
  }
}

// Export singleton instance
export const emailService = new EmailService();
