import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  PhoneCall,
  MapPin,
  Search,
  User,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import leadService, { type Lead } from "../services/leadService";
import CreateLeadModal from "../components/Leads/CreateLeadModal";
import EditLeadModal from "../components/Leads/EditLeadModal";
import ConvertLeadModal from "../components/Leads/ConvertLeadModal";

const STATUS_OPTIONS: Array<{ value: Lead["status"]; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed-won", label: "Converted" },
  { value: "closed-lost", label: "Lost" },
];

const SOURCE_OPTIONS: Array<{ value: Lead["source"]; label: string }> = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "phone", label: "Phone/Cold Call" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email" },
  { value: "event", label: "Event" },
  { value: "advertisement", label: "Advertisement" },
  { value: "other", label: "Other" },
];

const LeadsNew: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 20;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fetch leads with filters
  const { data: leadsData, isLoading } = useQuery({
    queryKey: [
      "leads",
      {
        status: statusFilter,
        source: sourceFilter,
        priority: priorityFilter,
        search: searchQuery,
        page: currentPage,
        limit: leadsPerPage,
      },
    ],
    queryFn: () =>
      leadService.getLeads({
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
        priority: priorityFilter || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: leadsPerPage,
      }),
  });

  const leads: Lead[] = leadsData?.data || [];
  const totalLeads = leadsData?.total || 0;
  const totalPages = Math.ceil(totalLeads / leadsPerPage);

  // Delete lead mutation
  const deleteMutation = useMutation({
    mutationFn: leadService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted successfully");
    },
    onError: (error) => {
      // Error toast is already handled by api interceptor
      console.error("Delete lead error:", error);
    },
  });

  // Handle delete lead
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Handle edit lead
  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  // Handle modal success (refresh data)
  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  // Calculate stats - with safety check
  const stats = {
    total: totalLeads,
    new: Array.isArray(leads)
      ? leads.filter((l) => l.status === "new").length
      : 0,
    qualified: Array.isArray(leads)
      ? leads.filter((l) => l.status === "qualified").length
      : 0,
    converted: Array.isArray(leads)
      ? leads.filter((l) => l.status === "closed-won").length
      : 0,
  };

  const getStatusColor = (status: Lead["status"]) => {
    const colors: Record<Lead["status"], string> = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-purple-100 text-purple-800",
      qualified: "bg-yellow-100 text-yellow-800",
      proposal: "bg-indigo-100 text-indigo-800",
      negotiation: "bg-orange-100 text-orange-800",
      "closed-won": "bg-green-100 text-green-800",
      "closed-lost": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: Lead["status"]) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getSourceLabel = (source: Lead["source"]) => {
    const option = SOURCE_OPTIONS.find((opt) => opt.value === source);
    return option ? option.label : source;
  };

  const getPriorityColor = (priority?: Lead["priority"]) => {
    if (!priority) return "text-gray-500";
    const colors = {
      Low: "text-gray-500",
      Medium: "text-yellow-500",
      High: "text-red-500",
    } as const;
    return colors[priority] ?? "text-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            📡 Leads Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage potential customers through the sales pipeline
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Leads
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    New Leads
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.new}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Qualified
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.qualified}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Converted
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.converted}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search leads..."
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Leads Pipeline ({totalLeads} total)
          </h3>

          {isLoading ? (
            <div className="text-center py-12 text-sm text-gray-500">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <h4 className="text-sm font-medium text-gray-900">
                No leads found
              </h4>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filters, or create a new lead
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <PhoneCall className="h-3 w-3 mr-1" />
                                {lead.phone}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {lead.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.company || "-"}
                          </div>
                          {lead.address?.city && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {lead.address.city}
                              {lead.address.state && `, ${lead.address.state}`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {getStatusLabel(lead.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getSourceLabel(lead.source)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${getPriorityColor(
                              lead.priority
                            )}`}
                          >
                            {lead.priority || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.estimatedValue
                            ? `₹${lead.estimatedValue.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            {/* Convert Button - Only for qualified leads */}
                            {lead.status === "qualified" && (
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setShowConvertModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Convert to Customer"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(lead)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Lead"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(
                                  lead._id,
                                  `${lead.firstName} ${lead.lastName}`
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * leadsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * leadsPerPage, totalLeads)}
                        </span>{" "}
                        of <span className="font-medium">{totalLeads}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateLeadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      />
      <EditLeadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
        lead={selectedLead}
      />
      <ConvertLeadModal
        isOpen={showConvertModal}
        onClose={() => {
          setShowConvertModal(false);
          setSelectedLead(null);
        }}
        onSuccess={handleModalSuccess}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadsNew;
