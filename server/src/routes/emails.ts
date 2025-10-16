import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { emailService } from '../services/emailService';
import { Email, EmailType, EmailStatus } from '../models/Email';
import { Customer } from '../models/Customer';
import { Lead } from '../models/Lead';
import { Activity } from '../models/Activity';
import { logger } from '../config/logger';

const router = express.Router();

// Test email connection
router.get('/test-connection', auth, async (req: Request, res: Response) => {
  try {
    const isConnected = await emailService.testConnection();
    res.json({
      success: isConnected,
      message: isConnected
        ? 'Email service is configured and working'
        : 'Email service configuration failed',
    });
  } catch (error) {
    logger.error('Email connection test failed:', error);
    res.status(500).json({ error: 'Failed to test email connection' });
  }
});

// Send a custom email
router.post('/send', auth, async (req: Request, res: Response) => {
  try {
    const { to, subject, message, customerId, leadId, dealId, type } = req.body;

    // Validate input
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email
    const sent = await emailService.sendEmail({
      to: Array.isArray(to) ? to : [to],
      subject,
      html: message,
    });

    if (!sent) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Save email to database
    const email = await Email.create({
      to: Array.isArray(to) ? to : [to],
      from: process.env.EMAIL_USER || '',
      subject,
      html: message,
      type: type || EmailType.CUSTOM,
      status: EmailStatus.SENT,
      customerId,
      leadId,
      dealId,
      sentBy: req.user.id,
      sentAt: new Date(),
    });

    // Create activity if customer/lead/deal is specified
    if (customerId || leadId || dealId) {
      await Activity.create({
        type: 'email',
        title: `Email sent: ${subject}`,
        description: `Sent email to ${Array.isArray(to) ? to.join(', ') : to}`,
        customerId,
        leadId,
        dealId,
        userId: req.user.id,
        metadata: { emailId: email._id },
      });
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      emailId: email._id,
    });
  } catch (error) {
    logger.error('Failed to send email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send welcome email to customer
router.post('/send-welcome', auth, async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    // Get customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send welcome email
    const sent = await emailService.sendWelcomeEmail(
      customer.email,
      customer.name
    );

    if (!sent) {
      return res.status(500).json({ error: 'Failed to send welcome email' });
    }

    // Save email to database
    const email = await Email.create({
      to: [customer.email],
      from: process.env.EMAIL_USER || '',
      subject: 'Welcome to BharatNet CRM!',
      html: 'Welcome email sent',
      type: EmailType.WELCOME,
      status: EmailStatus.SENT,
      customerId: customer._id,
      sentBy: req.user.id,
      sentAt: new Date(),
    });

    // Create activity
    await Activity.create({
      type: 'email',
      title: 'Welcome email sent',
      description: `Sent welcome email to ${customer.name}`,
      customerId: customer._id,
      userId: req.user.id,
      metadata: { emailId: email._id },
    });

    res.json({
      success: true,
      message: 'Welcome email sent successfully',
      emailId: email._id,
    });
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

// Send follow-up email
router.post('/send-followup', auth, async (req: Request, res: Response) => {
  try {
    const { customerId, leadId, subject, message } = req.body;

    if ((!customerId && !leadId) || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let recipient;
    let recipientName;

    // Get recipient details
    if (customerId) {
      recipient = await Customer.findById(customerId);
      recipientName = recipient?.name;
    } else {
      recipient = await Lead.findById(leadId);
      recipientName = recipient?.name;
    }

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Send follow-up email
    const sent = await emailService.sendFollowUpEmail(
      recipient.email,
      recipientName,
      subject,
      message
    );

    if (!sent) {
      return res.status(500).json({ error: 'Failed to send follow-up email' });
    }

    // Save email to database
    const email = await Email.create({
      to: [recipient.email],
      from: process.env.EMAIL_USER || '',
      subject,
      html: message,
      type: EmailType.FOLLOWUP,
      status: EmailStatus.SENT,
      customerId,
      leadId,
      sentBy: req.user.id,
      sentAt: new Date(),
    });

    // Create activity
    await Activity.create({
      type: 'email',
      title: `Follow-up email sent: ${subject}`,
      description: `Sent follow-up email to ${recipientName}`,
      customerId,
      leadId,
      userId: req.user.id,
      metadata: { emailId: email._id },
    });

    res.json({
      success: true,
      message: 'Follow-up email sent successfully',
      emailId: email._id,
    });
  } catch (error) {
    logger.error('Failed to send follow-up email:', error);
    res.status(500).json({ error: 'Failed to send follow-up email' });
  }
});

// Send bulk emails
router.post('/send-bulk', auth, async (req: Request, res: Response) => {
  try {
    const { customerIds, subject, message } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || !subject || !message) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Get customers
    const customers = await Customer.find({ _id: { $in: customerIds } });

    if (customers.length === 0) {
      return res.status(404).json({ error: 'No customers found' });
    }

    // Prepare recipients
    const recipients = customers.map((customer) => ({
      email: customer.email,
      name: customer.name,
    }));

    // Send bulk emails
    const result = await emailService.sendBulkEmails(
      recipients,
      subject,
      (name) => `
        <p>Hi <strong>${name}</strong>,</p>
        ${message}
        <p>Best regards,<br><strong>The BharatNet CRM Team</strong></p>
      `,
      1000 // 1 second delay between emails
    );

    // Save emails to database
    const emailPromises = customers.map(async (customer) => {
      const email = await Email.create({
        to: [customer.email],
        from: process.env.EMAIL_USER || '',
        subject,
        html: message,
        type: EmailType.CAMPAIGN,
        status: EmailStatus.SENT,
        customerId: customer._id,
        sentBy: req.user.id,
        sentAt: new Date(),
      });

      // Create activity
      await Activity.create({
        type: 'email',
        title: `Campaign email sent: ${subject}`,
        description: `Sent campaign email to ${customer.name}`,
        customerId: customer._id,
        userId: req.user.id,
        metadata: { emailId: email._id },
      });

      return email;
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: 'Bulk emails sent',
      result,
    });
  } catch (error) {
    logger.error('Failed to send bulk emails:', error);
    res.status(500).json({ error: 'Failed to send bulk emails' });
  }
});

// Get email history
router.get('/history', auth, async (req: Request, res: Response) => {
  try {
    const { customerId, leadId, dealId, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (customerId) query.customerId = customerId;
    if (leadId) query.leadId = leadId;
    if (dealId) query.dealId = dealId;

    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('sentBy', 'name email')
      .populate('customerId', 'name email')
      .populate('leadId', 'name email')
      .populate('dealId', 'title');

    const total = await Email.countDocuments(query);

    res.json({
      emails,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get email history:', error);
    res.status(500).json({ error: 'Failed to get email history' });
  }
});

// Get email by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const email = await Email.findById(req.params.id)
      .populate('sentBy', 'name email')
      .populate('customerId', 'name email')
      .populate('leadId', 'name email')
      .populate('dealId', 'title');

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(email);
  } catch (error) {
    logger.error('Failed to get email:', error);
    res.status(500).json({ error: 'Failed to get email' });
  }
});

// Mark email as opened (tracking)
router.post('/:id/opened', async (req: Request, res: Response) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    if (!email.openedAt) {
      email.status = EmailStatus.OPENED;
      email.openedAt = new Date();
      await email.save();
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
    });
    res.end(pixel);
  } catch (error) {
    logger.error('Failed to track email open:', error);
    res.status(500).send();
  }
});

export default router;
