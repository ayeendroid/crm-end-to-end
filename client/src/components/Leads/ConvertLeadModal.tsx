import React, { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import leadService, { type Lead } from "../../services/leadService";
import customerService from "../../services/customerService";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead | null;
}

const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Customer basic info (pre-populated from lead)
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "active" as "active" | "inactive" | "prospect",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
    // ISP Plan details
    plan: {
      type: "Fiber" as "Fiber" | "Broadband" | "Wireless",
      speed: "100Mbps",
      price: 999,
      billingCycle: "Monthly" as "Monthly" | "Quarterly" | "Annual",
      ottApps: [] as string[],
      liveChannels: 350,
    },
    usage: {
      dataConsumed: 0,
      averageSpeed: 0,
      uptime: 100,
      mostUsedOTT: [] as string[],
      peakUsageHours: [] as string[],
    },
    tickets: 0,
    nps_score: 8,
    churnRisk: "Low" as "Low" | "Medium" | "High",
  });

  // Pre-populate form from lead data
  useEffect(() => {
    if (lead) {
      setFormData((prev) => ({
        ...prev,
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        address: {
          street: lead.address?.street || "",
          city: lead.address?.city || "",
          state: lead.address?.state || "",
          zipCode: lead.address?.zipCode || "",
          country: lead.address?.country || "India",
        },
        // Set plan based on lead's ISP interest
        plan: {
          ...prev.plan,
          type: (lead.ispInterest?.serviceType as any) || "Fiber",
          speed: lead.ispInterest?.speedRequirement || "100Mbps",
          billingCycle:
            (lead.ispInterest?.preferredDuration as any) || "Monthly",
        },
      }));
    }
  }, [lead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof formData] as any),
          [child]:
            parent === "plan" && child === "price" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create customer with lead data
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: formData.status,
        assignedTo: lead.assignedTo, // Use the lead's assigned user
        address: formData.address,
        // Wrap ISP-specific data in ispData object
        ispData: {
          plan: formData.plan,
          usage: formData.usage,
          customerSince: new Date(),
          lifetimeValue: formData.plan.price * 12, // Estimate annual value
          churnRisk: formData.churnRisk,
          npsScore: formData.nps_score,
          tickets: formData.tickets,
        },
      };

      await customerService.createCustomer(customerData);

      // Step 2: Update lead status to 'closed-won'
      await leadService.updateLead(lead._id, {
        status: "closed-won",
        notes: `Converted to customer on ${new Date().toLocaleDateString()}`,
      });

      toast.success(
        `🎉 Lead converted to customer successfully! Redirecting...`
      );

      onSuccess();
      onClose();

      // Step 3: Redirect to customer page after short delay
      setTimeout(() => {
        navigate(`/customers`);
      }, 1500);
    } catch (error: any) {
      console.error("Convert lead error:", error);
      // Error already handled by API interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !lead) return null;

  // ISP Plan options
  const planOptions = {
    speeds: ["50Mbps", "100Mbps", "200Mbps", "500Mbps", "1Gbps"],
    prices: {
      "50Mbps": 499,
      "100Mbps": 999,
      "200Mbps": 1499,
      "500Mbps": 2499,
      "1Gbps": 3999,
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Convert Lead to Customer
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete the customer details and select an ISP plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Lead Info Summary */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 m-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowRight className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Converting Lead:</span>{" "}
                {lead.firstName} {lead.lastName} ({lead.email})
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Company: {lead.company || "N/A"} • Source: {lead.source}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-2">
                1
              </span>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-2">
                2
              </span>
              Installation Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ISP Plan Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-2">
                3
              </span>
              ISP Plan Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connection Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="plan.type"
                  value={formData.plan.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Fiber">Fiber (Recommended)</option>
                  <option value="Broadband">Broadband</option>
                  <option value="Wireless">Wireless</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speed <span className="text-red-500">*</span>
                </label>
                <select
                  name="plan.speed"
                  value={formData.plan.speed}
                  onChange={(e) => {
                    handleChange(e);
                    // Auto-update price based on speed
                    const speed = e.target
                      .value as keyof typeof planOptions.prices;
                    setFormData((prev) => ({
                      ...prev,
                      plan: {
                        ...prev.plan,
                        speed,
                        price: planOptions.prices[speed] || 999,
                      },
                    }));
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {planOptions.speeds.map((speed) => (
                    <option key={speed} value={speed}>
                      {speed} - ₹
                      {planOptions.prices[
                        speed as keyof typeof planOptions.prices
                      ].toLocaleString()}
                      /month
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="plan.price"
                  value={formData.plan.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Cycle <span className="text-red-500">*</span>
                </label>
                <select
                  name="plan.billingCycle"
                  value={formData.plan.billingCycle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly (5% off)</option>
                  <option value="Annual">Annual (10% off)</option>
                </select>
              </div>
            </div>

            {/* Plan Benefits */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">
                📦 Plan Benefits:
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Unlimited Data Usage</li>
                <li>✓ 40+ OTT Apps (Netflix, Prime Video, Disney+, etc.)</li>
                <li>✓ 350+ Live TV Channels</li>
                <li>✓ 24/7 Customer Support</li>
                <li>✓ Free Installation & Setup</li>
              </ul>
            </div>
          </div>

          {/* Estimated Value */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Estimated Annual Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(formData.plan.price * 12).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Monthly Billing</p>
                <p className="text-xl font-semibold text-green-600">
                  ₹{formData.plan.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Convert to Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertLeadModal;
