import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import dealService, { Deal, DealFilters } from "../services/dealService";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
} from "lucide-react";
import CreateDealModal from "../components/Deals/CreateDealModal";
import EditDealModal from "../components/Deals/EditDealModal";
import DealDetailsModal from "../components/Deals/DealDetailsModal";

const Deals: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DealFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Fetch deals
  const { data, isLoading, error } = useQuery(
    ["deals", filters],
    () => dealService.getDeals(filters),
    {
      keepPreviousData: true,
    }
  );

  // Fetch stats
  const { data: stats } = useQuery("dealStats", dealService.getDealStats);

  // Delete mutation
  const deleteMutation = useMutation(dealService.deleteDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries("deals");
      queryClient.invalidateQueries("dealStats");
      alert("Deal deleted successfully!");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to delete deal");
    },
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof DealFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  // Handle delete
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get stage badge color
  const getStageColor = (stage: Deal["stage"]) => {
    switch (stage) {
      case "prospecting":
        return "bg-gray-100 text-gray-800";
      case "qualification":
        return "bg-blue-100 text-blue-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-yellow-100 text-yellow-800";
      case "closed-won":
        return "bg-green-100 text-green-800";
      case "closed-lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get probability color
  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600";
    if (probability >= 50) return "text-yellow-600";
    if (probability >= 25) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">
            Manage your sales pipeline and track deals
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = "/pipeline")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="w-5 h-5" />
            Pipeline View
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm">Total Pipeline Value</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(stats.totalValue)}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {stats.total} deals
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm">Won Deals</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {formatCurrency(stats.wonValue)}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {stats.wonDeals} deals
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm">Average Deal Size</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(stats.averageValue)}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {stats.averageProbability.toFixed(0)}% avg probability
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm">Lost Deals</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(stats.lostValue)}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {stats.lostDeals} deals
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals by title or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                value={filters.stage || ""}
                onChange={(e) =>
                  handleFilterChange("stage", e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Stages</option>
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Value
              </label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.minValue || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minValue",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Value
              </label>
              <input
                type="number"
                placeholder="₹999,999"
                value={filters.maxValue || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxValue",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || "createdAt"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="value">Deal Value</option>
                <option value="expectedCloseDate">Expected Close</option>
                <option value="probability">Probability</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading deals...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Error loading deals. Please try again.
          </div>
        ) : data?.deals.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No deals found. Create your first deal to get started!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Close
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.deals.map((deal) => (
                    <tr key={deal._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {deal.title}
                          </div>
                          {deal.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {deal.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deal.customer.firstName} {deal.customer.lastName}
                        </div>
                        {deal.customer.company && (
                          <div className="text-sm text-gray-500">
                            {deal.customer.company}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(deal.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(
                            deal.stage
                          )}`}
                        >
                          {deal.stage.replace("-", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-medium ${getProbabilityColor(
                            deal.probability
                          )}`}
                        >
                          {deal.probability}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(deal.expectedCloseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deal.assignedTo.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDeal(deal);
                              setShowDetailsModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDeal(deal);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(deal._id, deal.title)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {(data.pagination.page - 1) * data.pagination.limit + 1} to{" "}
                  {Math.min(
                    data.pagination.page * data.pagination.limit,
                    data.pagination.total
                  )}{" "}
                  of {data.pagination.total} deals
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page! - 1 })
                    }
                    disabled={data.pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-gray-700">
                    Page {data.pagination.page} of {data.pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page! + 1 })
                    }
                    disabled={data.pagination.page === data.pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateDealModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditDealModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDeal(null);
        }}
        deal={selectedDeal}
      />

      <DealDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedDeal(null);
        }}
        deal={selectedDeal}
        onEdit={() => {
          setShowDetailsModal(false);
          setShowEditModal(true);
        }}
        onDelete={() => {
          if (selectedDeal) {
            setShowDetailsModal(false);
            handleDelete(selectedDeal._id, selectedDeal.title);
            setSelectedDeal(null);
          }
        }}
      />
    </div>
  );
};

export default Deals;
