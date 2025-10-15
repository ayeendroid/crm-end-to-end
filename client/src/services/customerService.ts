import api, { ApiResponse } from "./api";

// ISP-specific interfaces
export interface ISPPlan {
  type?: "Fiber" | "Broadband" | "Wireless";
  speed?: string;
  price?: number;
  billingCycle?: "Monthly" | "Quarterly" | "Annual";
  ottApps?: string[];
  liveChannels?: number;
}

export interface ISPUsage {
  dataConsumed?: number;
  averageSpeed?: number;
  uptime?: number;
  mostUsedOTT?: string[];
  peakUsageHours?: string[];
}

export interface ISPData {
  plan?: ISPPlan;
  usage?: ISPUsage;
  customerSince?: Date | string;
  lifetimeValue?: number;
  churnRisk?: "Low" | "Medium" | "High";
  npsScore?: number;
  tickets?: number;
  lastTicketDate?: Date | string;
  satisfaction?: 1 | 2 | 3 | 4 | 5;
  referredBy?: string;
  nextBillingDate?: Date | string;
  outstandingAmount?: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  tags?: string[];
  source?: string;
  status?: "active" | "inactive" | "prospect";
  assignedTo?: any;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  totalValue?: number;
  notes?: string;
  ispData?: ISPData;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
  churnRisk?: string;
  planType?: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all customers
export const getCustomers = async (
  params?: CustomerListParams
): Promise<CustomerListResponse> => {
  const response = await api.get<ApiResponse<CustomerListResponse>>(
    "/customers",
    { params }
  );
  return response.data.data!;
};

// Get single customer
export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get<ApiResponse<{ customer: Customer }>>(
    `/customers/${id}`
  );
  return response.data.data!.customer;
};

// Create customer
export const createCustomer = async (
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await api.post<ApiResponse<{ customer: Customer }>>(
    "/customers",
    data
  );
  return response.data.data!.customer;
};

// Update customer
export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await api.put<ApiResponse<{ customer: Customer }>>(
    `/customers/${id}`,
    data
  );
  return response.data.data!.customer;
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customers/${id}`);
};
