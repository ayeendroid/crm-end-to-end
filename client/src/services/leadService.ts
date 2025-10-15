import api from "./api";

// Lead Interfaces
export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  source:
    | "website"
    | "referral"
    | "social"
    | "email"
    | "phone"
    | "event"
    | "advertisement"
    | "other";
  priority?: "Low" | "Medium" | "High";
  estimatedValue?: number;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  ispInterest?: {
    serviceType?: "Fiber" | "Broadband" | "Wireless";
    speedRequirement?: string;
    budgetRange?: string;
    preferredDuration?: "Monthly" | "Quarterly" | "Annual";
  };
  assignedTo?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  source:
    | "website"
    | "referral"
    | "social"
    | "email"
    | "phone"
    | "event"
    | "advertisement"
    | "other";
  priority?: string;
  estimatedValue?: number;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  ispInterest?: {
    serviceType?: string;
    speedRequirement?: string;
    budgetRange?: string;
    preferredDuration?: string;
  };
  followUpDate?: string;
}

export interface ConvertLeadData {
  // Customer fields to create
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  status: "active" | "inactive" | "prospect";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  // ISP Plan details
  ispData?: {
    plan?: {
      type?: "Fiber" | "Broadband" | "Wireless";
      speed?: string;
      price?: number;
      billingCycle?: "Monthly" | "Quarterly" | "Annual";
      ottApps?: string[];
      liveChannels?: number;
    };
  };
}

// Lead Service Functions
export const leadService = {
  // Get all leads with optional filters
  getLeads: async (filters?: LeadFilters) => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.source) params.append("source", filters.source);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/leads?${params.toString()}`);

    // Backend returns: { success: true, data: { leads, pagination } }
    // Transform to: { data: [], total: 0 }
    const backendData = response.data.data;
    return {
      data: backendData.leads || [],
      total: backendData.pagination?.total || 0,
      page: backendData.pagination?.page || 1,
      pages: backendData.pagination?.pages || 1,
    };
  },

  // Get single lead by ID
  getLead: async (id: string) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Create new lead
  createLead: async (data: LeadFormData) => {
    const response = await api.post("/leads", data);
    return response.data;
  },

  // Update existing lead
  updateLead: async (id: string, data: Partial<LeadFormData>) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id: string) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  // Convert lead to customer
  convertLeadToCustomer: async (
    leadId: string,
    customerData: ConvertLeadData
  ) => {
    // First create the customer
    const customerResponse = await api.post("/customers", customerData);

    // Then update the lead status to closed-won to match backend enums
    await api.put(`/leads/${leadId}`, { status: "closed-won" });

    return customerResponse.data;
  },
};

export default leadService;
