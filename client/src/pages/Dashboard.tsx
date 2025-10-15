import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Minus,
  Target,
  Award,
  Loader2,
  Download,
  Filter,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import ActivityTimeline from "../components/ActivityTimeline/ActivityTimeline";
import analyticsService from "../services/analyticsService";

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [showCharts, setShowCharts] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    stats: true,
    alerts: true,
    revenueChart: true,
    dealsChart: true,
    pipelineChart: true,
    leadSourceChart: true,
    customerGrowthChart: true,
    funnelChart: true,
    timeline: true,
    quickActions: true,
    networkStatus: true,
  });

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case "7d":
        start.setDate(start.getDate() - 7);
        break;
      case "30d":
        start.setDate(start.getDate() - 30);
        break;
      case "90d":
        start.setDate(start.getDate() - 90);
        break;
      case "1y":
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const { start, end } = getDateRange();

  // Fetch overview metrics
  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
    error: overviewError,
  } = useQuery({
    queryKey: ["analytics-overview", start, end],
    queryFn: () => analyticsService.getOverview(start, end),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch trend data
  const {
    data: trends,
    isLoading: trendsLoading,
    refetch: refetchTrends,
    error: trendsError,
  } = useQuery({
    queryKey: ["analytics-trends"],
    queryFn: () => analyticsService.getTrends(6), // Last 6 months
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!overview, // Only fetch after overview loads
  });

  // Fetch deal pipeline
  const {
    data: pipeline,
    isLoading: pipelineLoading,
    error: pipelineError,
  } = useQuery({
    queryKey: ["analytics-pipeline"],
    queryFn: () => analyticsService.getDealPipeline(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!overview, // Only fetch after overview loads
  });

  // Fetch lead performance
  const {
    data: leadPerf,
    isLoading: leadPerfLoading,
    error: leadPerfError,
  } = useQuery({
    queryKey: ["analytics-lead-performance"],
    queryFn: () => analyticsService.getLeadPerformance(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!overview && !!trends, // Only fetch after overview and trends load
  });

  // Fetch customer insights
  const {
    data: customerInsights,
    isLoading: insightsLoading,
    error: insightsError,
  } = useQuery({
    queryKey: ["customer-insights"],
    queryFn: () => analyticsService.getCustomerInsights(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!overview && !!trends, // Only fetch after overview and trends load
  });

  const isLoading =
    overviewLoading ||
    insightsLoading ||
    trendsLoading ||
    pipelineLoading ||
    leadPerfLoading;

  // Check for errors
  const hasError =
    overviewError ||
    trendsError ||
    pipelineError ||
    leadPerfError ||
    insightsError;
  const isRateLimited =
    (overviewError as any)?.response?.status === 429 ||
    (trendsError as any)?.response?.status === 429 ||
    (pipelineError as any)?.response?.status === 429 ||
    (leadPerfError as any)?.response?.status === 429 ||
    (insightsError as any)?.response?.status === 429;

  // Prepare chart data from trends
  const revenueChartData =
    trends?.revenue.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      revenue: item.revenue / 1000, // Convert to thousands
    })) || [];

  const customerChartData =
    trends?.customers.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      customers: item.count,
    })) || [];

  const dealsChartData =
    trends?.deals.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      deals: item.count,
      revenue: item.revenue / 1000,
    })) || [];

  // Prepare pipeline data
  const pipelineChartData =
    pipeline?.byStage.map((stage) => ({
      stage: stage._id,
      count: stage.count,
      value: stage.totalValue / 1000, // Convert to thousands
    })) || [];

  // Prepare lead source data
  const leadSourceData =
    leadPerf?.bySource.map((source) => ({
      name: source._id,
      value: source.count,
      qualified: source.qualified,
    })) || [];

  // Prepare conversion funnel data
  const funnelData = overview
    ? [
        {
          name: "Total Leads",
          stage: "Total Leads",
          value: overview.leads.total,
          fill: "#3B82F6",
          percentage: 100,
        },
        {
          name: "Qualified Leads",
          stage: "Qualified Leads",
          value: overview.leads.qualified,
          fill: "#8B5CF6",
          percentage:
            overview.leads.total > 0
              ? Math.round(
                  (overview.leads.qualified / overview.leads.total) * 100
                )
              : 0,
        },
        {
          name: "Active Deals",
          stage: "Active Deals",
          value: overview.deals.total,
          fill: "#10B981",
          percentage:
            overview.leads.total > 0
              ? Math.round((overview.deals.total / overview.leads.total) * 100)
              : 0,
        },
        {
          name: "Won Deals",
          stage: "Won Deals",
          value: overview.deals.won,
          fill: "#F59E0B",
          percentage:
            overview.leads.total > 0
              ? Math.round((overview.deals.won / overview.leads.total) * 100)
              : 0,
        },
      ]
    : [];

  // Colors for charts
  const COLORS = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  // Enhanced stats with real API data
  const stats = overview
    ? [
        {
          name: "Monthly Revenue (MRR)",
          value: `₹${(overview.revenue.monthly / 1000).toFixed(1)}K`,
          rawValue: overview.revenue.monthly,
          change: "+8.3%",
          changeValue: `+₹${(overview.revenue.monthly * 0.083).toFixed(0)}`,
          changeType: "positive" as const,
          icon: DollarSign,
          gradient: "from-emerald-500 to-green-600",
          bgGradient: "from-emerald-50 to-green-50",
          iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
        },
        {
          name: "Active Customers",
          value: overview.customers.active.toLocaleString("en-IN"),
          rawValue: overview.customers.active,
          change: "+12.4%",
          changeValue: `+${Math.round(overview.customers.active * 0.124)}`,
          changeType: "positive" as const,
          icon: Users,
          gradient: "from-blue-500 to-indigo-600",
          bgGradient: "from-blue-50 to-indigo-50",
          iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        },
        {
          name: "Qualified Leads",
          value: overview.leads.qualified.toLocaleString("en-IN"),
          rawValue: overview.leads.qualified,
          change: `${overview.metrics.conversionRate.toFixed(1)}%`,
          changeValue: "Conv. Rate",
          changeType: "positive" as const,
          icon: Target,
          gradient: "from-purple-500 to-pink-600",
          bgGradient: "from-purple-50 to-pink-50",
          iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
        },
        {
          name: "Won Deals",
          value: overview.deals.won.toLocaleString("en-IN"),
          rawValue: overview.deals.won,
          change: `${overview.metrics.winRate}%`,
          changeValue: "Win Rate",
          changeType: "positive" as const,
          icon: Award,
          gradient: "from-indigo-500 to-blue-600",
          bgGradient: "from-indigo-50 to-blue-50",
          iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600",
        },
      ]
    : [];

  const alerts =
    customerInsights && overview
      ? [
          {
            type: "warning",
            message: `${
              customerInsights.churnRisk.find((r) => r._id === "High")?.count ||
              0
            } customers at high churn risk - immediate action needed`,
            action: "View List",
          },
          {
            type: "info",
            message: `Average NPS Score: ${customerInsights.nps.avgNPS.toFixed(
              1
            )}/10 - Customer satisfaction is ${
              customerInsights.nps.avgNPS >= 8 ? "strong" : "needs improvement"
            }`,
            action: "Details",
          },
          {
            type: "success",
            message: `Total Revenue: ₹${(
              overview.revenue.total / 100000
            ).toFixed(
              1
            )}L - Average deal size: ₹${overview.revenue.average.toLocaleString(
              "en-IN"
            )}`,
            action: "View Reports",
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            BharatNet Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your CRM today.
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
          {/* Date Range Picker */}
          <div className="relative inline-block text-left">
            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as "7d" | "30d" | "90d" | "1y")
              }
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          {/* Toggle Charts Button */}
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {showCharts ? "Hide" : "Show"} Charts
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              refetchOverview();
              refetchTrends();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>

          {/* Customize Widgets Button */}
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </button>

          {/* Export Button */}
          <button
            onClick={() => {
              // Export to PDF functionality - placeholder for now
              alert("Export to PDF feature coming soon!");
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customize Dashboard Widgets
            </h3>
            <button
              onClick={() => {
                setVisibleWidgets({
                  stats: true,
                  alerts: true,
                  revenueChart: true,
                  dealsChart: true,
                  pipelineChart: true,
                  leadSourceChart: true,
                  customerGrowthChart: true,
                  funnelChart: true,
                  timeline: true,
                  quickActions: true,
                  networkStatus: true,
                });
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to Default
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(visibleWidgets).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setVisibleWidgets({
                      ...visibleWidgets,
                      [key]: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                {value ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      )}

      {/* Error State */}
      {!isLoading && hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800">
                {isRateLimited
                  ? "Too Many Requests"
                  : "Error Loading Dashboard"}
              </h3>
              <p className="mt-2 text-sm text-red-700">
                {isRateLimited
                  ? "You have made too many requests. Please wait a moment before refreshing."
                  : "There was an error loading the dashboard data. Please try again."}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    setTimeout(() => {
                      refetchOverview();
                      refetchTrends();
                    }, 2000); // Wait 2 seconds before retry
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry in 2 seconds
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Stats Grid */}
      {!isLoading && !hasError && stats.length > 0 && visibleWidgets.stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.changeType === "positive"
                ? TrendingUp
                : stat.changeType === "negative"
                ? TrendingDown
                : Minus;

            return (
              <div
                key={stat.name}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Gradient Background Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative">
                  {/* Icon and Trend */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-700"
                          : stat.changeType === "negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <TrendIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span
                        className={
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {stat.changeValue}
                      </span>
                      <span>vs last month</span>
                    </p>
                  </div>
                </div>

                {/* Bottom gradient line on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alerts Section */}
      {!isLoading &&
        !hasError &&
        alerts.length > 0 &&
        visibleWidgets.alerts && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                System Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md"
                  >
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                      <span className="text-sm text-yellow-800">
                        {alert.message}
                      </span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
                      {alert.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Conversion Funnel Chart */}
      {!isLoading && !hasError && visibleWidgets.funnelChart && overview && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Conversion Funnel
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Track your lead-to-customer conversion journey
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="none"
                  dataKey="name"
                  formatter={(value: string, entry: any) =>
                    `${value}: ${entry.value} (${entry.percentage}%)`
                  }
                />
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {funnelData.map((stage) => (
              <div
                key={stage.name}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: stage.fill }}
                ></div>
                <div className="text-xs font-medium text-gray-600">
                  {stage.name}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {stage.value}
                </div>
                <div className="text-xs text-gray-500">
                  {stage.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {!isLoading && !hasError && showCharts && (
        <>
          {/* Revenue & Deals Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            {visibleWidgets.revenueChart && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Revenue Trend (Last 6 Months)
                </h3>
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                        formatter={(value: any) => [
                          `₹${value.toFixed(1)}K`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <Filter className="h-12 w-12" />
                    <span className="ml-2">No data available</span>
                  </div>
                )}
              </div>
            )}

            {/* Deals Trend Chart */}
            {visibleWidgets.dealsChart && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Deals Performance
                </h3>
                {dealsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dealsChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="deals"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Deal Count"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Revenue (₹K)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <Filter className="h-12 w-12" />
                    <span className="ml-2">No data available</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pipeline & Lead Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deal Pipeline Chart */}
            {visibleWidgets.pipelineChart && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Deal Pipeline by Stage
                </h3>
                {pipelineChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pipelineChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="stage"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6B7280"
                        style={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="count"
                        fill="#3B82F6"
                        name="Deal Count"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="value"
                        fill="#10B981"
                        name="Value (₹K)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <Filter className="h-12 w-12" />
                    <span className="ml-2">No data available</span>
                  </div>
                )}
              </div>
            )}

            {/* Lead Sources Pie Chart */}
            {visibleWidgets.leadSourceChart && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Lead Distribution by Source
                </h3>
                {leadSourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                        }) => {
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x =
                            cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y =
                            cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              style={{ fontSize: 12, fontWeight: "bold" }}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {leadSourceData.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <Filter className="h-12 w-12" />
                    <span className="ml-2">No data available</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer Growth Chart */}
          {visibleWidgets.customerGrowthChart && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customer Growth Trend
              </h3>
              {customerChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="month"
                      stroke="#6B7280"
                      style={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="customers"
                      fill="#8B5CF6"
                      name="New Customers"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <Filter className="h-12 w-12" />
                  <span className="ml-2">No data available</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Activity Timeline and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        {visibleWidgets.timeline && (
          <ActivityTimeline maxVisible={5} showLoadMore={true} />
        )}

        {/* Quick Actions */}
        {visibleWidgets.quickActions && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Subscriber
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Schedule Site Survey
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Support Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Network Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">
                Network: Operational (99.2% uptime)
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">
                OTT Services: All Active
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">
                Customer Portal: Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
