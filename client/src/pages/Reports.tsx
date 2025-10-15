import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  Download,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import reportService from "../services/reportService";

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState("6months");

  // Fetch reports data
  const { data: salesData, isLoading: salesLoading } = useQuery(
    ["sales-performance", dateRange],
    () => reportService.getSalesPerformance(dateRange)
  );

  const { data: leadsData, isLoading: leadsLoading } = useQuery(
    ["lead-analytics", dateRange],
    () => reportService.getLeadAnalytics(dateRange)
  );

  const { data: customersData, isLoading: customersLoading } = useQuery(
    ["customer-metrics", dateRange],
    () => reportService.getCustomerMetrics(dateRange)
  );

  const isLoading = salesLoading || leadsLoading || customersLoading;

  // Calculate metrics
  const winRate = salesData
    ? salesData.totalDeals > 0
      ? ((salesData.wonDeals / salesData.totalDeals) * 100).toFixed(1)
      : "0"
    : "0";

  const leadConversionRate = leadsData
    ? leadsData.totalLeads > 0
      ? ((leadsData.qualifiedLeads / leadsData.totalLeads) * 100).toFixed(1)
      : "0"
    : "0";

  const customerActiveRate = customersData
    ? customersData.totalCustomers > 0
      ? ((customersData.activeCustomers / customersData.totalCustomers) * 100).toFixed(1)
      : "0"
    : "0";

  // Chart data
  const dealStageData = [
    { name: "Total Deals", value: salesData?.totalDeals || 0, color: "#3b82f6" },
    { name: "Won Deals", value: salesData?.wonDeals || 0, color: "#10b981" },
    {
      name: "Lost/Open",
      value: (salesData?.totalDeals || 0) - (salesData?.wonDeals || 0),
      color: "#ef4444",
    },
  ];

  const leadStatusData = [
    { name: "Total Leads", value: leadsData?.totalLeads || 0, color: "#8b5cf6" },
    { name: "Qualified", value: leadsData?.qualifiedLeads || 0, color: "#10b981" },
    {
      name: "Other",
      value: (leadsData?.totalLeads || 0) - (leadsData?.qualifiedLeads || 0),
      color: "#f59e0b",
    },
  ];

  const customerStatusData = [
    {
      name: "Active",
      value: customersData?.activeCustomers || 0,
      color: "#10b981",
    },
    {
      name: "Inactive",
      value:
        (customersData?.totalCustomers || 0) -
        (customersData?.activeCustomers || 0),
      color: "#ef4444",
    },
  ];

  // Export handlers
  const handleExportSales = () => {
    if (!salesData) return;
    const data = [
      {
        metric: "Total Deals",
        value: salesData.totalDeals,
      },
      {
        metric: "Won Deals",
        value: salesData.wonDeals,
      },
      {
        metric: "Total Revenue",
        value: salesData.totalRevenue,
      },
      {
        metric: "Win Rate",
        value: `${winRate}%`,
      },
    ];
    reportService.exportToCSV(data, `sales-report-${dateRange}`);
  };

  const handleExportLeads = () => {
    if (!leadsData) return;
    const data = [
      {
        metric: "Total Leads",
        value: leadsData.totalLeads,
      },
      {
        metric: "Qualified Leads",
        value: leadsData.qualifiedLeads,
      },
      {
        metric: "Conversion Rate",
        value: `${leadConversionRate}%`,
      },
    ];
    reportService.exportToCSV(data, `leads-report-${dateRange}`);
  };

  const handleExportCustomers = () => {
    if (!customersData) return;
    const data = [
      {
        metric: "Total Customers",
        value: customersData.totalCustomers,
      },
      {
        metric: "Active Customers",
        value: customersData.activeCustomers,
      },
      {
        metric: "Active Rate",
        value: `${customerActiveRate}%`,
      },
    ];
    reportService.exportToCSV(data, `customers-report-${dateRange}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Real-time data and insights from your CRM database
          </p>
        </div>
        <div className="mt-4 flex gap-3 md:mt-0 md:ml-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {reportService.formatCurrency(salesData?.totalRevenue || 0)}
                  </p>
                  <p className="text-blue-100 text-xs mt-1">
                    From {salesData?.wonDeals || 0} won deals
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-blue-200" />
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {reportService.formatNumber(
                      customersData?.totalCustomers || 0
                    )}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    {customerActiveRate}% active rate
                  </p>
                </div>
                <Users className="h-12 w-12 text-green-200" />
              </div>
            </div>

            {/* Total Leads */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Leads
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {reportService.formatNumber(leadsData?.totalLeads || 0)}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">
                    {leadConversionRate}% qualified
                  </p>
                </div>
                <Target className="h-12 w-12 text-purple-200" />
              </div>
            </div>

            {/* Win Rate */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Deal Win Rate
                  </p>
                  <p className="text-3xl font-bold mt-2">{winRate}%</p>
                  <p className="text-orange-100 text-xs mt-1">
                    {salesData?.wonDeals || 0} of {salesData?.totalDeals || 0}{" "}
                    deals
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Performance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Deal outcomes breakdown
                  </p>
                </div>
                <button
                  onClick={handleExportSales}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dealStageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {dealStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData?.totalDeals || 0}
                  </p>
                  <p className="text-xs text-gray-500">Total Deals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {salesData?.wonDeals || 0}
                  </p>
                  <p className="text-xs text-gray-500">Won</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{winRate}%</p>
                  <p className="text-xs text-gray-500">Win Rate</p>
                </div>
              </div>
            </div>

            {/* Lead Analytics Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lead Analytics
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Lead qualification status
                  </p>
                </div>
                <button
                  onClick={handleExportLeads}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={leadStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {leadsData?.totalLeads || 0}
                  </p>
                  <p className="text-xs text-gray-500">Total Leads</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {leadsData?.qualifiedLeads || 0}
                  </p>
                  <p className="text-xs text-gray-500">Qualified</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {leadConversionRate}%
                  </p>
                  <p className="text-xs text-gray-500">Qualification Rate</p>
                </div>
              </div>
            </div>

            {/* Customer Status Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Status
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Active vs inactive customers
                  </p>
                </div>
                <button
                  onClick={handleExportCustomers}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={customerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customersData?.totalCustomers || 0}
                  </p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {customersData?.activeCustomers || 0}
                  </p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {customerActiveRate}%
                  </p>
                  <p className="text-xs text-gray-500">Active Rate</p>
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Report Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reportService.formatCurrency(salesData?.totalRevenue || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Average Deal Size
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reportService.formatCurrency(
                      salesData?.wonDeals
                        ? salesData.totalRevenue / salesData.wonDeals
                        : 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total Customers
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reportService.formatNumber(
                      customersData?.totalCustomers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Leads</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reportService.formatNumber(leadsData?.totalLeads || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Win Rate</span>
                  <span className="text-sm font-semibold text-green-600">
                    {winRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Lead Qualification Rate
                  </span>
                  <span className="text-sm font-semibold text-purple-600">
                    {leadConversionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Real-Time Data
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  All reports are generated from live database data. Use the date
                  range selector above to filter results. Export any report to CSV
                  for further analysis.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
