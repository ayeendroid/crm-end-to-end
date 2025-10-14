import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Video,
  Target,
  Sparkles,
  ArrowUpRight,
  Edit,
  MoreVertical,
  Download,
  Share2,
  Tag,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CustomerDetail {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: "active" | "inactive" | "at-risk";
  tier: "premium" | "standard" | "basic";
  joinDate: string;
  lastActivity: string;
  totalRevenue: number;
  lifetimeValue: number;
  healthScore: number;
  aiInsights: {
    churnRisk: number;
    upsellPotential: number;
    engagementLevel: string;
    nextBestAction: string;
    recommendations: string[];
  };
}

const Customer360View: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock customer data
  const customer: CustomerDetail = {
    id: "1",
    name: "Rajesh Kumar",
    company: "TechCorp India Pvt Ltd",
    email: "rajesh.kumar@techcorp.in",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra, India",
    avatar: "RK",
    status: "active",
    tier: "premium",
    joinDate: "2022-03-15",
    lastActivity: "2024-05-20T14:30:00",
    totalRevenue: 850000,
    lifetimeValue: 1250000,
    healthScore: 85,
    aiInsights: {
      churnRisk: 15,
      upsellPotential: 78,
      engagementLevel: "High",
      nextBestAction: "Schedule quarterly business review",
      recommendations: [
        "Offer premium support upgrade",
        "Introduce new analytics features",
        "Schedule training session for new team members",
      ],
    },
  };

  // Revenue trend data
  const revenueData = [
    { month: "Nov", revenue: 65000, predicted: null },
    { month: "Dec", revenue: 72000, predicted: null },
    { month: "Jan", revenue: 68000, predicted: null },
    { month: "Feb", revenue: 75000, predicted: null },
    { month: "Mar", revenue: 82000, predicted: null },
    { month: "Apr", revenue: 78000, predicted: null },
    { month: "May", revenue: null, predicted: 85000 },
    { month: "Jun", revenue: null, predicted: 90000 },
  ];

  // Activity data
  const activityData = [
    { week: "W1", emails: 15, calls: 8, meetings: 3 },
    { week: "W2", emails: 12, calls: 5, meetings: 2 },
    { week: "W3", emails: 18, calls: 10, meetings: 4 },
    { week: "W4", emails: 20, calls: 12, meetings: 5 },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "meeting",
      title: "Quarterly Business Review",
      description: "Discussed Q2 performance and roadmap",
      timestamp: "2024-05-20T14:30:00",
      user: "Priya Sharma",
      icon: Video,
      color: "blue",
    },
    {
      id: 2,
      type: "email",
      title: "Feature Request Follow-up",
      description: "Sent information about new analytics dashboard",
      timestamp: "2024-05-19T10:15:00",
      user: "Amit Kumar",
      icon: Mail,
      color: "purple",
    },
    {
      id: 3,
      type: "call",
      title: "Support Call",
      description: "Resolved integration issue",
      timestamp: "2024-05-18T16:45:00",
      user: "Sneha Reddy",
      icon: Phone,
      color: "green",
    },
    {
      id: 4,
      type: "note",
      title: "Internal Note",
      description: "Customer expressed interest in enterprise features",
      timestamp: "2024-05-17T09:20:00",
      user: "Rahul Mehta",
      icon: FileText,
      color: "yellow",
    },
  ];

  // Active deals
  const deals = [
    {
      id: 1,
      name: "Annual Renewal - Enterprise",
      value: 450000,
      stage: "Negotiation",
      probability: 85,
      closeDate: "2024-06-30",
      status: "on-track",
    },
    {
      id: 2,
      name: "Upsell - Premium Support",
      value: 120000,
      stage: "Proposal",
      probability: 65,
      closeDate: "2024-07-15",
      status: "on-track",
    },
    {
      id: 3,
      name: "Add-on Services",
      value: 75000,
      stage: "Qualification",
      probability: 45,
      closeDate: "2024-08-01",
      status: "at-risk",
    },
  ];

  // Documents
  const documents = [
    {
      id: 1,
      name: "Contract_2024.pdf",
      type: "Contract",
      date: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Invoice_MAY24.pdf",
      type: "Invoice",
      date: "2024-05-01",
      size: "156 KB",
    },
    {
      id: 3,
      name: "Proposal_Q2.pdf",
      type: "Proposal",
      date: "2024-04-20",
      size: "1.8 MB",
    },
    {
      id: 4,
      name: "Meeting_Notes.docx",
      type: "Notes",
      date: "2024-05-20",
      size: "84 KB",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      "at-risk": "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getTierColor = (tier: string) => {
    const colors = {
      premium: "bg-purple-100 text-purple-800 border-purple-200",
      standard: "bg-blue-100 text-blue-800 border-blue-200",
      basic: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[tier as keyof typeof colors] || colors.standard;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Customer Info Card */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {customer.avatar}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {customer.name}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {customer.company}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="hover:text-blue-600"
                  >
                    {customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="hover:text-blue-600"
                  >
                    {customer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Customer since {formatDate(customer.joinDate)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    customer.status
                  )}`}
                >
                  {customer.status.charAt(0).toUpperCase() +
                    customer.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierColor(
                    customer.tier
                  )}`}
                >
                  {customer.tier.charAt(0).toUpperCase() +
                    customer.tier.slice(1)}{" "}
                  Tier
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                  Last active: {formatTime(customer.lastActivity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 lg:w-48">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Mail className="h-5 w-5" />
            Send Email
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Phone className="h-5 w-5" />
            Call Now
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Video className="h-5 w-5" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-xl font-bold">AI-Powered Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide mb-1 text-white/80">
              Health Score
            </div>
            <div className="text-3xl font-bold mb-1">
              {customer.healthScore}
            </div>
            <div className="text-xs text-white/80">
              {customer.healthScore >= 80
                ? "Excellent"
                : customer.healthScore >= 60
                ? "Good"
                : "Needs Attention"}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide mb-1 text-white/80">
              Churn Risk
            </div>
            <div className="text-3xl font-bold mb-1">
              {customer.aiInsights.churnRisk}%
            </div>
            <div className="text-xs text-white/80">
              {customer.aiInsights.churnRisk < 30
                ? "Low Risk"
                : customer.aiInsights.churnRisk < 60
                ? "Medium Risk"
                : "High Risk"}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide mb-1 text-white/80">
              Upsell Potential
            </div>
            <div className="text-3xl font-bold mb-1">
              {customer.aiInsights.upsellPotential}%
            </div>
            <div className="text-xs text-white/80">
              {customer.aiInsights.upsellPotential >= 70
                ? "High Potential"
                : "Moderate Potential"}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide mb-1 text-white/80">
              Engagement
            </div>
            <div className="text-3xl font-bold mb-1">
              {customer.aiInsights.engagementLevel}
            </div>
            <div className="text-xs text-white/80">Activity Level</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Next Best Action</span>
          </div>
          <p className="text-white/90 mb-3">
            {customer.aiInsights.nextBestAction}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">
              AI Recommendations:
            </p>
            <ul className="space-y-1">
              {customer.aiInsights.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="text-sm text-white/90 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(customer.totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Lifetime Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(customer.lifetimeValue)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Deals</p>
          <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Recent Activities</p>
          <p className="text-2xl font-bold text-gray-900">
            {recentActivities.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {["overview", "activities", "deals", "documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Revenue Trend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(value) => `₹${value / 1000}K`}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Actual"
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Engagement Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="emails"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Emails"
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Calls"
                    />
                    <Area
                      type="monotone"
                      dataKey="meetings"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      name="Meetings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === "activities" && (
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg bg-${activity.color}-100 flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {activity.user}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === "deals" && (
            <div className="space-y-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {deal.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium text-green-600">
                        {formatCurrency(deal.value)}
                      </span>
                      <span>•</span>
                      <span>{deal.stage}</span>
                      <span>•</span>
                      <span>{deal.probability}% probability</span>
                      <span>•</span>
                      <span>Close: {formatDate(deal.closeDate)}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    View <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {doc.type}
                        </span>
                        <span>•</span>
                        <span>{formatDate(doc.date)}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <Download className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customer360View;
