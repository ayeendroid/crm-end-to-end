import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
} from "lucide-react";
import { planUpgrades } from "../services/dataService";

const Deals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Filter upgrades
  const filteredUpgrades = useMemo(() => {
    return planUpgrades.filter((upgrade) => {
      const matchesSearch =
        upgrade.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        upgrade.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || upgrade.status === statusFilter;
      const matchesType =
        typeFilter === "All" || upgrade.upgradeType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOpportunities = planUpgrades.length;
    const pendingApprovals = planUpgrades.filter(
      (u) => u.status === "Pending Approval"
    ).length;
    const totalMRRImpact = planUpgrades
      .filter((u) => u.status === "Approved" || u.status === "Implemented")
      .reduce((sum, u) => sum + u.mrrImpact, 0);
    const avgSuccess =
      planUpgrades.reduce((sum, u) => sum + u.probability, 0) /
      planUpgrades.length;

    return {
      totalOpportunities,
      pendingApprovals,
      totalMRRImpact,
      avgSuccess,
    };
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Proposed: "bg-blue-100 text-blue-800",
      "Customer Contacted": "bg-purple-100 text-purple-800",
      "Pending Approval": "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Implemented: "bg-teal-100 text-teal-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Speed Upgrade":
        return <ArrowUpCircle className="h-4 w-4 text-green-600" />;
      case "Downgrade":
        return <ArrowDownCircle className="h-4 w-4 text-red-600" />;
      case "OTT Add-on":
        return <Package className="h-4 w-4 text-purple-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Plan Changes & Upgrades
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track plan upgrades, downgrades, and add-on services to grow revenue
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Process Upgrade
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Opportunities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOpportunities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Approvals
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingApprovals}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">MRR Impact</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalMRRImpact.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Avg Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgSuccess.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by customer or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Status</option>
            <option value="Proposed">Proposed</option>
            <option value="Customer Contacted">Customer Contacted</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Implemented">Implemented</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Types</option>
            <option value="Speed Upgrade">Speed Upgrade</option>
            <option value="Plan Change">Plan Change</option>
            <option value="OTT Add-on">OTT Add-on</option>
            <option value="Downgrade">Downgrade</option>
          </select>
        </div>
      </div>

      {/* Upgrades Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRR Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUpgrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">⚡</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upgrades found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUpgrades.map((upgrade) => (
                  <tr key={upgrade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {upgrade.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {upgrade.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {upgrade.currentPlan.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {upgrade.currentPlan.speed} • ₹
                        {upgrade.currentPlan.price}/mo
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {upgrade.proposedPlan.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {upgrade.proposedPlan.speed} • ₹
                        {upgrade.proposedPlan.price}/mo
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(upgrade.upgradeType)}
                        <span className="text-sm text-gray-900">
                          {upgrade.upgradeType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          upgrade.status
                        )}`}
                      >
                        {upgrade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          upgrade.mrrImpact >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {upgrade.mrrImpact >= 0 ? "+" : ""}₹
                        {upgrade.mrrImpact.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {upgrade.probability}%
                        </div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${upgrade.probability}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deals;
