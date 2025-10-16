import api from "./api";

// Email types
export interface Email {
  _id: string;
  to: string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  type: "welcome" | "followup" | "invoice" | "campaign" | "custom";
  status: "pending" | "sent" | "failed" | "bounced" | "opened" | "clicked";
  customerId?: string;
  leadId?: string;
  dealId?: string;
  sentBy: {
    _id: string;
    name: string;
    email: string;
  };
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendEmailData {
  to: string | string[];
  subject: string;
  message: string;
  customerId?: string;
  leadId?: string;
  dealId?: string;
  type?: string;
}

export interface SendBulkEmailData {
  customerIds: string[];
  subject: string;
  message: string;
}

export interface EmailHistoryResponse {
  emails: Email[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Test email connection
export const testEmailConnection = async () => {
  const response = await api.get("/emails/test-connection");
  return response.data;
};

// Send a custom email
export const sendEmail = async (data: SendEmailData) => {
  const response = await api.post("/emails/send", data);
  return response.data;
};

// Send welcome email to customer
export const sendWelcomeEmail = async (customerId: string) => {
  const response = await api.post("/emails/send-welcome", { customerId });
  return response.data;
};

// Send follow-up email
export const sendFollowUpEmail = async (data: {
  customerId?: string;
  leadId?: string;
  subject: string;
  message: string;
}) => {
  const response = await api.post("/emails/send-followup", data);
  return response.data;
};

// Send bulk emails
export const sendBulkEmails = async (data: SendBulkEmailData) => {
  const response = await api.post("/emails/send-bulk", data);
  return response.data;
};

// Get email history
export const getEmailHistory = async (params: {
  customerId?: string;
  leadId?: string;
  dealId?: string;
  page?: number;
  limit?: number;
}): Promise<EmailHistoryResponse> => {
  const response = await api.get("/emails/history", { params });
  return response.data;
};

// Get email by ID
export const getEmailById = async (id: string): Promise<Email> => {
  const response = await api.get(`/emails/${id}`);
  return response.data;
};

// Email service object
const emailService = {
  testConnection: testEmailConnection,
  sendEmail,
  sendWelcomeEmail,
  sendFollowUpEmail,
  sendBulkEmails,
  getEmailHistory,
  getEmailById,
};

export default emailService;
