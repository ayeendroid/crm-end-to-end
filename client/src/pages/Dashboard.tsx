import React from "react";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Signal,
  Minus,
} from "lucide-react";
import ActivityTimeline from "../components/ActivityTimeline/ActivityTimeline";
import {
  mockBharatNetCustomers,
  getCustomerAnalytics,
} from "../data/mockBharatNetData";

const Dashboard: React.FC = () => {
  // Get real analytics from BharatNet data
  const analytics = getCustomerAnalytics(mockBharatNetCustomers);

  // Enhanced stats with ISP-specific metrics
  const stats = [
    {
      name: "Monthly Revenue (MRR)",
      value: `₹${(analytics.totalRevenue / 100000).toFixed(1)}L`,
      rawValue: analytics.totalRevenue,
      change: "+8.3%",
      changeValue: "+₹35K",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    {
      name: "Active Subscribers",
      value: analytics.active.toLocaleString("en-IN"),
      rawValue: analytics.active,
      change: "+12.4%",
      changeValue: "+52",
      changeType: "positive" as const,
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      name: "Avg Uptime",
      value: `${analytics.avgUptime}%`,
      rawValue: parseFloat(analytics.avgUptime),
      change: "+0.3%",
      changeValue: "+0.3%",
      changeType: "positive" as const,
      icon: Signal,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
    {
      name: "Churn Rate",
      value: "2.1%",
      rawValue: 2.1,
      change: "-0.5%",
      changeValue: "-0.5%",
      changeType: "positive" as const,
      icon: TrendingDown,
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600",
    },
  ];

  const alerts = [
    {
      type: "warning",
      message: `${analytics.churnRisk.high} customers at high churn risk - immediate action needed`,
      action: "View List",
    },
    {
      type: "info",
      message: `Average NPS Score: ${analytics.avgNPS}/10 - Customer satisfaction is strong`,
      action: "Details",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            BharatNet Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Anmol! Here's what's happening with your ISP today.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
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
                    <span className="text-xs font-semibold">{stat.change}</span>
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

      {/* Alerts Section */}
      {alerts.length > 0 && (
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

      {/* Activity Timeline and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <ActivityTimeline maxVisible={5} showLoadMore={true} />

        {/* Quick Actions */}
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
