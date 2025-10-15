import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  TrendingUp,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wifi,
} from "lucide-react";
import { ConfirmDialog, FormModal, Drawer } from "../components/UI";
import {
  mockBharatNetCustomers,
  type BharatNetCustomer,
} from "../data/mockBharatNetData";

const Customers: React.FC = () => {
  const [customers] = useState(mockBharatNetCustomers);

  // Debug: Log customer count
  React.useEffect(() => {
    console.log("🔍 Total BharatNet Customers:", customers.length);
    console.log("📊 Sample Customer:", customers[0]);
  }, [customers]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Suspended" | "Cancelled"
  >("All");
  const [filterChurnRisk, setFilterChurnRisk] = useState<
    "All" | "Low" | "Medium" | "High"
  >("All");
  const [filterPlanType, setFilterPlanType] = useState<
    "All" | "Fiber" | "Broadband" | "Wireless"
  >("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<BharatNetCustomer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.location.city.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "All") {
      result = result.filter((c) => c.status === filterStatus);
    }

    // Churn risk filter
    if (filterChurnRisk !== "All") {
      result = result.filter((c) => c.churnRisk === filterChurnRisk);
    }

    // Plan type filter
    if (filterPlanType !== "All") {
      result = result.filter((c) => c.plan.type === filterPlanType);
    }

    return result;
  }, [customers, searchTerm, filterStatus, filterChurnRisk, filterPlanType]);

  // Paginated customers
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Stats
  const stats = useMemo(() => {
    const activeCustomers = filteredCustomers.filter(
      (c) => c.status === "Active"
    ).length;
    const totalRevenue = filteredCustomers
      .filter((c) => c.status === "Active")
      .reduce((sum, c) => sum + c.plan.price, 0);
    const highRisk = filteredCustomers.filter(
      (c) => c.churnRisk === "High"
    ).length;
    const avgNPS =
      filteredCustomers.length > 0
        ? filteredCustomers.reduce((sum, c) => sum + c.npsScore, 0) /
          filteredCustomers.length
        : 0;

    return { activeCustomers, totalRevenue, highRisk, avgNPS };
  }, [filteredCustomers]);

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-50 text-green-700";
      case "Medium":
        return "bg-yellow-50 text-yellow-700";
      case "High":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const openDeleteDialog = (customer: BharatNetCustomer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const openDetailsDrawer = (customer: BharatNetCustomer) => {
    setSelectedCustomer(customer);
    setIsDetailsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            BharatNet Customers
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeCustomers.toLocaleString("en-IN")}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{(stats.totalRevenue / 100000).toFixed(1)}L
              </p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Churn Risk</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.highRisk}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg NPS Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.avgNPS.toFixed(1)}/10
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, city, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filters
            {(filterStatus !== "All" ||
              filterChurnRisk !== "All" ||
              filterPlanType !== "All") && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Churn Risk
              </label>
              <select
                value={filterChurnRisk}
                onChange={(e) => setFilterChurnRisk(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                value={filterPlanType}
                onChange={(e) => setFilterPlanType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Plans</option>
                <option value="Fiber">Fiber</option>
                <option value="Broadband">Broadband</option>
                <option value="Wireless">Wireless</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churn Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPS Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={12} />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <MapPin size={14} className="text-gray-400" />
                      {customer.location.city}, {customer.location.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Wifi size={14} className="text-blue-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.plan.type} {customer.plan.speed}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{customer.plan.price}/mo
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getChurnRiskColor(
                        customer.churnRisk
                      )}`}
                    >
                      {customer.churnRisk} Risk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {customer.npsScore}/10
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetailsDrawer(customer)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(customer)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredCustomers.length}</span>{" "}
              customers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Customer Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCustomer}
        title="ग्राहक जोड़ें | Add Customer"
        submitText="Create Customer"
        isSubmitting={isSubmitting}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Himalayan Tech Solutions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number *
            </label>
            <input
              type="text"
              required
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="05ABCDE1234F1Z5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="contact@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dehradun"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select State</option>
              <option value="uttarakhand">Uttarakhand</option>
              <option value="delhi">Delhi</option>
              <option value="up">Uttar Pradesh</option>
              <option value="punjab">Punjab</option>
              <option value="haryana">Haryana</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="हटाएं ग्राहक? | Delete Customer?"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone and will remove all associated data including deals, invoices, and activity history.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        type="danger"
        isLoading={isSubmitting}
      />

      {/* Customer Details Drawer */}
      <Drawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        title="Customer Details | ग्राहक विवरण"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {selectedCustomer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {selectedCustomer.location.city},{" "}
                  {selectedCustomer.location.state}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedCustomer.status
                    )}`}
                  >
                    {selectedCustomer.status}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getChurnRiskColor(
                      selectedCustomer.churnRisk
                    )}`}
                  >
                    {selectedCustomer.churnRisk} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-900">
                    {selectedCustomer.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-900">
                    {selectedCustomer.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Customer Since: </span>
                  <span className="text-gray-900">
                    {new Date(
                      selectedCustomer.customerSince
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Wifi size={18} className="text-blue-500" />
                Plan Details
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan Type</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.plan.type} {selectedCustomer.plan.speed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Price</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{selectedCustomer.plan.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Billing Cycle</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.plan.billingCycle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">OTT Apps</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.plan.ottApps.length} apps
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Live Channels</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.plan.liveChannels}+ channels
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCustomer.plan.ottApps
                  .slice(0, 6)
                  .map((app: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"
                    >
                      {app}
                    </span>
                  ))}
                {selectedCustomer.plan.ottApps.length > 6 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    +{selectedCustomer.plan.ottApps.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900">Usage Statistics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Data Consumed</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedCustomer.usage.dataConsumed.toFixed(0)} GB
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Avg Speed</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedCustomer.usage.averageSpeed.toFixed(0)} Mbps
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Uptime</p>
                  <p className="text-lg font-bold text-green-600">
                    {selectedCustomer.usage.uptime.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Most Used</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.usage.mostUsedOTT[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900">Business Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(selectedCustomer.lifetimeValue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Lifetime Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.npsScore}/10
                  </p>
                  <p className="text-xs text-gray-500 mt-1">NPS Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.tickets}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Support Tickets</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Customers;
