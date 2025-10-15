import api, { ApiResponse } from "./api";

// Deal Interfaces
export interface Deal {
  _id: string;
  title: string;
  description?: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    company?: string;
    email: string;
  };
  value: number;
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  probability: number; // 0-100
  expectedCloseDate: string;
  actualCloseDate?: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  tags: string[];
  products?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }>;
  activities?: string[];
  notes?: string;
  lostReason?: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DealFormData {
  title: string;
  description?: string;
  customer: string; // ObjectId as string
  value: number;
  stage?:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  probability?: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  assignedTo?: string; // ObjectId as string
  tags?: string[];
  notes?: string;
  lostReason?: string;
}

export interface DealFilters {
  stage?: string;
  assignedTo?: string;
  customer?: string;
  search?: string;
  minValue?: number;
  maxValue?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DealListResponse {
  deals: Deal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all deals with filters
export const getDeals = async (
  filters?: DealFilters
): Promise<DealListResponse> => {
  const params: any = {};

  if (filters) {
    if (filters.stage) params.stage = filters.stage;
    if (filters.assignedTo) params.assignedTo = filters.assignedTo;
    if (filters.customer) params.customer = filters.customer;
    if (filters.search) params.search = filters.search;
    if (filters.minValue !== undefined) params.minValue = filters.minValue;
    if (filters.maxValue !== undefined) params.maxValue = filters.maxValue;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  }

  const response = await api.get<ApiResponse<DealListResponse>>("/deals", {
    params,
  });

  // Handle response structure
  if (response.data.data) {
    return response.data.data;
  }

  // Fallback if data structure is different
  return {
    deals: (response.data as any).deals || [],
    pagination: (response.data as any).pagination || {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
  };
};

// Get single deal by ID
export const getDeal = async (id: string): Promise<Deal> => {
  const response = await api.get<ApiResponse<Deal>>(`/deals/${id}`);
  return response.data.data!;
};

// Create new deal
export const createDeal = async (data: DealFormData): Promise<Deal> => {
  const response = await api.post<ApiResponse<Deal>>("/deals", data);
  return response.data.data!;
};

// Update deal
export const updateDeal = async (
  id: string,
  data: Partial<DealFormData>
): Promise<Deal> => {
  const response = await api.put<ApiResponse<Deal>>(`/deals/${id}`, data);
  return response.data.data!;
};

// Delete deal
export const deleteDeal = async (id: string): Promise<void> => {
  await api.delete(`/deals/${id}`);
};

// Change deal stage (for Kanban drag-and-drop)
export const changeDealStage = async (
  id: string,
  newStage: Deal["stage"],
  probability?: number
): Promise<Deal> => {
  const updateData: Partial<DealFormData> = { stage: newStage };

  // Auto-adjust probability based on stage
  if (probability === undefined) {
    switch (newStage) {
      case "prospecting":
        updateData.probability = 10;
        break;
      case "qualification":
        updateData.probability = 25;
        break;
      case "proposal":
        updateData.probability = 50;
        break;
      case "negotiation":
        updateData.probability = 75;
        break;
      case "closed-won":
        updateData.probability = 100;
        updateData.actualCloseDate = new Date().toISOString();
        break;
      case "closed-lost":
        updateData.probability = 0;
        updateData.actualCloseDate = new Date().toISOString();
        break;
    }
  } else {
    updateData.probability = probability;
  }

  return updateDeal(id, updateData);
};

// Get deals by stage (for pipeline view)
export const getDealsByStage = async (): Promise<Record<string, Deal[]>> => {
  const response = await getDeals({ limit: 1000 }); // Get all deals
  const dealsByStage: Record<string, Deal[]> = {
    prospecting: [],
    qualification: [],
    proposal: [],
    negotiation: [],
    "closed-won": [],
    "closed-lost": [],
  };

  response.deals.forEach((deal) => {
    if (dealsByStage[deal.stage]) {
      dealsByStage[deal.stage].push(deal);
    }
  });

  return dealsByStage;
};

// Get deal statistics
export const getDealStats = async (): Promise<{
  total: number;
  totalValue: number;
  wonDeals: number;
  wonValue: number;
  lostDeals: number;
  lostValue: number;
  averageValue: number;
  averageProbability: number;
}> => {
  const response = await getDeals({ limit: 1000 });
  const deals = response.deals;

  const wonDeals = deals.filter((d) => d.stage === "closed-won");
  const lostDeals = deals.filter((d) => d.stage === "closed-lost");
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const lostValue = lostDeals.reduce((sum, d) => sum + d.value, 0);

  return {
    total: deals.length,
    totalValue,
    wonDeals: wonDeals.length,
    wonValue,
    lostDeals: lostDeals.length,
    lostValue,
    averageValue: deals.length > 0 ? totalValue / deals.length : 0,
    averageProbability:
      deals.length > 0
        ? deals.reduce((sum, d) => sum + d.probability, 0) / deals.length
        : 0,
  };
};

// Default export
const dealService = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  changeDealStage,
  getDealsByStage,
  getDealStats,
};

export default dealService;
