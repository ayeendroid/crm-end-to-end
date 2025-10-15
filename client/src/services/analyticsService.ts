import api, { ApiResponse } from "./api";

// Analytics Interfaces
export interface OverviewMetrics {
  customers: {
    total: number;
    active: number;
    inactive: number;
  };
  leads: {
    total: number;
    qualified: number;
  };
  deals: {
    total: number;
    won: number;
    lost: number;
  };
  revenue: {
    total: number;
    monthly: number;
    average: number;
  };
  metrics: {
    conversionRate: number;
    winRate: string;
  };
}

export interface TrendData {
  customers: Array<{ _id: { year: number; month: number }; count: number }>;
  leads: Array<{ _id: { year: number; month: number }; count: number }>;
  deals: Array<{
    _id: { year: number; month: number };
    count: number;
    revenue: number;
  }>;
  revenue: Array<{ _id: { year: number; month: number }; revenue: number }>;
}

export interface LeadPerformance {
  bySource: Array<{
    _id: string;
    count: number;
    qualified: number;
    converted: number;
    totalValue: number;
  }>;
  byStatus: Array<{ _id: string; count: number }>;
  scoreDistribution: Array<{ _id: string | number; count: number }>;
  avgConversionTime: number;
}

export interface DealPipeline {
  byStage: Array<{
    _id: string;
    count: number;
    totalValue: number;
    avgProbability: number;
  }>;
  expectedRevenue: number;
  avgCycleTime: number;
  topDeals: Array<{
    _id: string;
    title: string;
    value: number;
    stage: string;
    customer: { firstName: string; lastName: string; company?: string };
    assignedTo: { name: string; email: string };
  }>;
}

export interface CustomerInsights {
  byStatus: Array<{ _id: string; count: number }>;
  byPlanType: Array<{ _id: string; count: number; avgPrice: number }>;
  churnRisk: Array<{ _id: string; count: number }>;
  nps: {
    avgNPS: number;
    npsScore: number;
    promoters?: number;
    passives?: number;
    detractors?: number;
  };
  lifetimeValue: {
    avgLTV: number;
    totalLTV: number;
    maxLTV?: number;
    minLTV?: number;
  };
}

export interface TeamPerformance {
  leadPerformance: Array<{
    _id: string;
    userName: string;
    userEmail: string;
    totalLeads: number;
    converted: number;
    conversionRate: number;
  }>;
  dealPerformance: Array<{
    _id: string;
    userName: string;
    userEmail: string;
    totalDeals: number;
    wonDeals: number;
    totalRevenue: number;
    winRate: number;
  }>;
}

// API Functions

/**
 * Get overview metrics
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 */
export const getOverview = async (
  startDate?: string,
  endDate?: string
): Promise<OverviewMetrics> => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get<ApiResponse<OverviewMetrics>>(
    "/analytics/overview",
    { params }
  );
  return response.data.data!;
};

/**
 * Get trend data for charts
 * @param months Number of months to fetch (default: 12)
 */
export const getTrends = async (months: number = 12): Promise<TrendData> => {
  const response = await api.get<ApiResponse<TrendData>>("/analytics/trends", {
    params: { months },
  });
  return response.data.data!;
};

/**
 * Get lead performance metrics
 */
export const getLeadPerformance = async (): Promise<LeadPerformance> => {
  const response = await api.get<ApiResponse<LeadPerformance>>(
    "/analytics/lead-performance"
  );
  return response.data.data!;
};

/**
 * Get deal pipeline metrics
 */
export const getDealPipeline = async (): Promise<DealPipeline> => {
  const response = await api.get<ApiResponse<DealPipeline>>(
    "/analytics/deal-pipeline"
  );
  return response.data.data!;
};

/**
 * Get customer insights
 */
export const getCustomerInsights = async (): Promise<CustomerInsights> => {
  const response = await api.get<ApiResponse<CustomerInsights>>(
    "/analytics/customer-insights"
  );
  return response.data.data!;
};

/**
 * Get team performance metrics
 */
export const getTeamPerformance = async (): Promise<TeamPerformance> => {
  const response = await api.get<ApiResponse<TeamPerformance>>(
    "/analytics/team-performance"
  );
  return response.data.data!;
};

// Default export
const analyticsService = {
  getOverview,
  getTrends,
  getLeadPerformance,
  getDealPipeline,
  getCustomerInsights,
  getTeamPerformance,
};

export default analyticsService;
