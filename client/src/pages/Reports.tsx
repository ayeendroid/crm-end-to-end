import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Wifi,
  AlertTriangle,
  Download,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  mockBharatNetCustomers,
  getCustomerAnalytics,
} from "../data/mockBharatNetData";
import {
  connectionLeads,
  planUpgrades,
  supportTickets,
} from "../services/dataService";

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState("6months");

  const analytics = useMemo(
    () => getCustomerAnalytics(mockBharatNetCustomers),
    []
  );

  // Revenue Trend Data (Last 6 months)
  const revenueData = useMemo(() => {
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const baseRevenue = analytics.totalRevenue;

    return months.map((month, index) => {
      const growthFactor = 0.85 + index * 0.025; // 15% growth over 6 months
      const revenue = Math.round(baseRevenue * growthFactor);
      const mrr = revenue;
      const arr = revenue * 12;

      return {
        month,
        revenue: revenue / 100000, // Convert to lakhs
        mrr: mrr / 100000,
        arr: arr / 1000000, // Convert to millions
        newCustomers: 20 + index * 5,
        churnedCustomers: 5 + Math.floor(Math.random() * 3),
      };
    });
  }, [analytics]);

  // Subscriber Growth Data
  const subscriberGrowthData = useMemo(() => {
    const total = analytics.total;
    return [
      {
        month: "May",
        active: Math.round(total * 0.88),
        suspended: Math.round(total * 0.08),
        cancelled: Math.round(total * 0.04),
      },
      {
        month: "Jun",
        active: Math.round(total * 0.9),
        suspended: Math.round(total * 0.07),
        cancelled: Math.round(total * 0.03),
      },
      {
        month: "Jul",
        active: Math.round(total * 0.92),
        suspended: Math.round(total * 0.06),
        cancelled: Math.round(total * 0.02),
      },
      {
        month: "Aug",
        active: Math.round(total * 0.94),
        suspended: Math.round(total * 0.05),
        cancelled: Math.round(total * 0.01),
      },
      {
        month: "Sep",
        active: Math.round(total * 0.96),
        suspended: Math.round(total * 0.03),
        cancelled: Math.round(total * 0.01),
      },
      {
        month: "Oct",
        active: analytics.active,
        suspended: analytics.suspended,
        cancelled: analytics.cancelled,
      },
    ];
  }, [analytics]);

  // Plan Distribution Data
  const planDistributionData = useMemo(() => {
    return Object.entries(analytics.planDistribution).map(([plan, count]) => ({
      name: plan,
      value: count,
      percentage: ((count / analytics.total) * 100).toFixed(1),
    }));
  }, [analytics]);

  // Churn Risk Analysis
  const churnRiskData = useMemo(() => {
    return [
      { name: "Low Risk", value: analytics.churnRisk.low, color: "#10b981" },
      {
        name: "Medium Risk",
        value: analytics.churnRisk.medium,
        color: "#f59e0b",
      },
      { name: "High Risk", value: analytics.churnRisk.high, color: "#ef4444" },
    ];
  }, [analytics]);

  // Support Ticket Trends
  const supportTrendData = useMemo(() => {
    const categories = [
      "Slow Internet",
      "No Connectivity",
      "OTT Issues",
      "Billing",
      "Router Issues",
      "Installation",
    ];

    return categories.map((category) => ({
      category: category.replace(" Issues", "").replace(" Query", ""),
      count: supportTickets.filter(
        (t) => t.category === category || t.category === category + " Query"
      ).length,
      resolved: supportTickets.filter(
        (t) =>
          (t.category === category || t.category === category + " Query") &&
          t.status === "Resolved"
      ).length,
    }));
  }, []);

  // Conversion Funnel Data
  const conversionFunnelData = useMemo(() => {
    const stages = [
      {
        stage: "New Inquiries",
        count: connectionLeads.filter((l) => l.status === "New").length,
        percentage: 100,
      },
      {
        stage: "Contacted",
        count: connectionLeads.filter((l) => l.status === "Contacted").length,
        percentage: 75,
      },
      {
        stage: "Site Survey",
        count: connectionLeads.filter(
          (l) => l.status === "Site Survey Scheduled"
        ).length,
        percentage: 55,
      },
      {
        stage: "Feasibility",
        count: connectionLeads.filter((l) => l.status === "Feasibility Check")
          .length,
        percentage: 40,
      },
      {
        stage: "Quotation",
        count: connectionLeads.filter((l) => l.status === "Quotation Sent")
          .length,
        percentage: 30,
      },
      {
        stage: "Converted",
        count: connectionLeads.filter((l) => l.status === "Converted").length,
        percentage: 20,
      },
    ];

    return stages;
  }, []);

  // Upgrade Revenue Impact
  const upgradeRevenueData = useMemo(() => {
    const types = ["Speed Upgrade", "Plan Change", "OTT Add-on", "Downgrade"];

    return types.map((type) => {
      const typeUpgrades = planUpgrades.filter((u) => u.upgradeType === type);
      const totalImpact = typeUpgrades.reduce((sum, u) => sum + u.mrrImpact, 0);
      const count = typeUpgrades.length;

      return {
        type: type.replace(" Upgrade", "").replace(" Add-on", ""),
        count,
        impact: totalImpact,
        avgImpact: count > 0 ? Math.round(totalImpact / count) : 0,
      };
    });
  }, []);

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Analytics & Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate detailed reports on subscribers, revenue, network
            performance, and churn
          </p>
        </div>
        <div className="mt-4 flex gap-3 md:mt-0 md:ml-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">
                ₹{(analytics.totalRevenue / 100000).toFixed(1)}L
              </p>
              <p className="text-blue-100 text-xs mt-1">Monthly Recurring</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Active Subscribers
              </p>
              <p className="text-3xl font-bold mt-2">
                {analytics.active.toLocaleString()}
              </p>
              <p className="text-green-100 text-xs mt-1">+12% vs last month</p>
            </div>
            <Users className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Network Uptime
              </p>
              <p className="text-3xl font-bold mt-2">{analytics.avgUptime}</p>
              <p className="text-purple-100 text-xs mt-1">Industry leading</p>
            </div>
            <Wifi className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Churn Risk</p>
              <p className="text-3xl font-bold mt-2">
                {analytics.churnRisk.high}
              </p>
              <p className="text-orange-100 text-xs mt-1">
                High risk customers
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Revenue Trend Analysis
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Monthly recurring revenue over time
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              label={{
                value: "Revenue (₹L)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `₹${value.toFixed(2)}L`,
                "Revenue",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="MRR"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subscriber Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Subscriber Growth Trend
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Active, suspended, and cancelled subscribers
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subscriberGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="active" fill="#10b981" name="Active" />
            <Bar dataKey="suspended" fill="#f59e0b" name="Suspended" />
            <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Plan Distribution
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Subscriber breakdown by plan type
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={planDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {planDistributionData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Churn Risk Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Churn Risk Analysis
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Customer risk distribution
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={churnRiskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {churnRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Support Ticket Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Support Ticket Analysis
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Ticket volume and resolution by category
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={supportTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Total Tickets" />
            <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Connection Conversion Funnel
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Lead progression through sales stages
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {conversionFunnelData.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {stage.stage}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stage.count} leads
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: `hsl(${220 - index * 20}, 70%, ${
                      50 + index * 5
                    }%)`,
                  }}
                >
                  {stage.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Revenue Impact */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Plan Upgrade Revenue Impact
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              MRR impact by upgrade type
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={upgradeRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="type" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              label={{
                value: "MRR Impact (₹)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Impact",
              ]}
            />
            <Legend />
            <Bar dataKey="impact" fill="#8b5cf6" name="Total MRR Impact" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
