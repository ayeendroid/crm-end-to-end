import api from './api';

// TypeScript interfaces for report data
export interface SalesPerformance {
  totalDeals: number;
  wonDeals: number;
  totalRevenue: number;
}

export interface LeadAnalytics {
  totalLeads: number;
  qualifiedLeads: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
}

export interface ReportResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Report Service
 * Handles all report-related API calls
 */
const reportService = {
  /**
   * Get sales performance report
   */
  async getSalesPerformance(dateRange?: string): Promise<SalesPerformance> {
    const params = dateRange ? { dateRange } : {};
    const response = await api.get<ReportResponse<SalesPerformance>>(
      '/reports/sales-performance',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get lead analytics report
   */
  async getLeadAnalytics(dateRange?: string): Promise<LeadAnalytics> {
    const params = dateRange ? { dateRange } : {};
    const response = await api.get<ReportResponse<LeadAnalytics>>(
      '/reports/lead-analytics',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get customer metrics report
   */
  async getCustomerMetrics(dateRange?: string): Promise<CustomerMetrics> {
    const params = dateRange ? { dateRange } : {};
    const response = await api.get<ReportResponse<CustomerMetrics>>(
      '/reports/customer-metrics',
      { params }
    );
    return response.data.data;
  },

  /**
   * Export report to CSV
   */
  exportToCSV(data: any[], filename: string) {
    // Convert data to CSV format
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Format currency for display
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  },

  /**
   * Format number with commas
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
};

export default reportService;
