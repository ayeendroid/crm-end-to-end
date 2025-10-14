import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  Zap,
  Brain,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Star,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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

const EnhancedDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // AI Insights and Predictions
  const aiInsights = [
    {
      id: 1,
      type: "prediction",
      icon: Brain,
      color: "purple",
      title: "Deal Prediction",
      description: 'High probability to close "Acme Corp - Enterprise Plan"',
      confidence: 92,
      action: "Review Deal",
      priority: "high",
    },
    {
      id: 2,
      type: "opportunity",
      icon: Sparkles,
      color: "blue",
      title: "Upsell Opportunity",
      description: "3 customers ready for premium upgrade",
      confidence: 85,
      action: "View Customers",
      priority: "medium",
    },
    {
      id: 3,
      type: "alert",
      icon: AlertCircle,
      color: "orange",
      title: "Churn Risk",
      description: "2 accounts showing decreased engagement",
      confidence: 78,
      action: "Take Action",
      priority: "high",
    },
    {
      id: 4,
      type: "recommendation",
      icon: Zap,
      color: "green",
      title: "Best Time to Contact",
      description: "Optimal engagement window: 10 AM - 12 PM today",
      confidence: 88,
      action: "Schedule Calls",
      priority: "medium",
    },
  ];

  // Enhanced metrics with AI predictions
  const metrics = [
    {
      name: "Revenue",
      value: "₹2.4L",
      change: "+15.3%",
      trend: "up",
      prediction: "₹2.8L next month",
      icon: DollarSign,
      color: "green",
      chartData: [
        { month: "Jan", value: 180000 },
        { month: "Feb", value: 195000 },
        { month: "Mar", value: 210000 },
        { month: "Apr", value: 240000 },
      ],
    },
    {
      name: "Customers",
      value: "1,247",
      change: "+12%",
      trend: "up",
      prediction: "1,380 next month",
      icon: Users,
      color: "blue",
      chartData: [
        { month: "Jan", value: 1000 },
        { month: "Feb", value: 1100 },
        { month: "Mar", value: 1180 },
        { month: "Apr", value: 1247 },
      ],
    },
    {
      name: "Active Deals",
      value: "89",
      change: "+8.2%",
      trend: "up",
      prediction: "95 next month",
      icon: Target,
      color: "purple",
      chartData: [
        { month: "Jan", value: 72 },
        { month: "Feb", value: 78 },
        { month: "Mar", value: 82 },
        { month: "Apr", value: 89 },
      ],
    },
    {
      name: "Win Rate",
      value: "68%",
      change: "+5.1%",
      trend: "up",
      prediction: "72% next month",
      icon: Activity,
      color: "indigo",
      chartData: [
        { month: "Jan", value: 58 },
        { month: "Feb", value: 62 },
        { month: "Mar", value: 65 },
        { month: "Apr", value: 68 },
      ],
    },
  ];

  // Sales pipeline data
  const pipelineData = [
    { name: "Prospecting", value: 45, color: "#3b82f6" },
    { name: "Qualification", value: 32, color: "#8b5cf6" },
    { name: "Proposal", value: 28, color: "#ec4899" },
    { name: "Negotiation", value: 15, color: "#f59e0b" },
    { name: "Closed Won", value: 23, color: "#10b981" },
  ];

  // Revenue forecast
  const forecastData = [
    { month: "May", actual: 240000, forecast: 260000, target: 280000 },
    { month: "Jun", actual: null, forecast: 275000, target: 300000 },
    { month: "Jul", actual: null, forecast: 290000, target: 320000 },
    { month: "Aug", actual: null, forecast: 310000, target: 350000 },
  ];

  // Top performers
  const topPerformers = [
    {
      id: 1,
      name: "Rahul Sharma",
      deals: 23,
      revenue: "₹5.2L",
      avatar: "RS",
      trend: "up",
      score: 95,
    },
    {
      id: 2,
      name: "Priya Patel",
      deals: 19,
      revenue: "₹4.8L",
      avatar: "PP",
      trend: "up",
      score: 92,
    },
    {
      id: 3,
      name: "Amit Kumar",
      deals: 17,
      revenue: "₹4.2L",
      avatar: "AK",
      trend: "up",
      score: 88,
    },
    {
      id: 4,
      name: "Sneha Reddy",
      deals: 15,
      revenue: "₹3.9L",
      avatar: "SR",
      trend: "up",
      score: 85,
    },
  ];

  // Recent activities with AI context
  const recentActivities = [
    {
      id: 1,
      type: "deal",
      title: "Deal won: Tech Solutions Ltd",
      description: "Closed enterprise plan - ₹2.5L ARR",
      time: "10 minutes ago",
      icon: CheckCircle,
      color: "green",
      aiContext: "Predicted with 94% confidence",
    },
    {
      id: 2,
      type: "meeting",
      title: "Upcoming: Demo with Acme Corp",
      description: "Product demonstration scheduled",
      time: "In 2 hours",
      icon: Calendar,
      color: "blue",
      aiContext: "High engagement signals detected",
    },
    {
      id: 3,
      type: "lead",
      title: "New qualified lead: StartupX",
      description: "AI scored: 85/100 - High potential",
      time: "1 hour ago",
      icon: Star,
      color: "yellow",
      aiContext: "Matches ideal customer profile",
    },
    {
      id: 4,
      type: "alert",
      title: "Follow-up reminder: 3 leads",
      description: "Leads going cold without contact",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "orange",
      aiContext: "Response urgency: High",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; light: string }
    > = {
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        border: "border-green-500",
        light: "bg-green-50",
      },
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-500",
        light: "bg-blue-50",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-500",
        light: "bg-purple-50",
      },
      indigo: {
        bg: "bg-indigo-500",
        text: "text-indigo-600",
        border: "border-indigo-500",
        light: "bg-indigo-50",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-orange-600",
        border: "border-orange-500",
        light: "bg-orange-50",
      },
      yellow: {
        bg: "bg-yellow-500",
        text: "text-yellow-600",
        border: "border-yellow-500",
        light: "bg-yellow-50",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI-Powered Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights and predictions for your business
          </p>
        </div>
        <div className="flex gap-2">
          {["7days", "30days", "90days", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {period === "7days" && "Last 7 Days"}
              {period === "30days" && "Last 30 Days"}
              {period === "90days" && "Last 90 Days"}
              {period === "year" && "This Year"}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-xl font-bold">AI Insights & Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h3 className="font-semibold mb-1 text-sm">{insight.title}</h3>
                <p className="text-xs text-white/80 mb-3">
                  {insight.description}
                </p>
                <button className="text-xs font-medium hover:underline flex items-center gap-1">
                  {insight.action} <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics with Mini Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const colors = getColorClasses(metric.color);
          return (
            <div
              key={metric.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.light}`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Brain className="h-3 w-3" />
                  <span>Forecast: {metric.prediction}</span>
                </div>
              </div>
              <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metric.chartData}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={`var(--${metric.color}-500)`}
                      fill={`var(--${metric.color}-100)`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Forecast */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Forecast
              </h3>
              <p className="text-sm text-gray-500">
                AI-powered predictions vs actual
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI Prediction</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) => `₹${value / 1000}K`}
              />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={3}
                name="Actual"
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="AI Forecast"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="3 3"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Sales Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pipelineData.map((stage) => (
              <div
                key={stage.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <span className="text-gray-700">{stage.name}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stage.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performers
            </h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {performer.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {performer.name}
                    </p>
                    {index === 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        🏆 #1
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-500">
                      {performer.deals} deals
                    </p>
                    <p className="text-xs font-semibold text-green-600">
                      {performer.revenue}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-purple-600">
                    {performer.score}
                  </div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities with AI Context */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Activity Timeline
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              const colors = getColorClasses(activity.color);
              return (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Brain className="h-3 w-3" />
                            <span>{activity.aiContext}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
