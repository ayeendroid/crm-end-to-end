import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createCustomer } from "../../services/customerService";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",

    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",

    // Status
    status: "prospect",

    // ISP Data
    planType: "Fiber",
    speed: "100Mbps",
    price: 999,
    billingCycle: "Monthly", // Changed to capitalized
    ottApps: [] as string[],
    liveChannels: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOttToggle = (app: string) => {
    setFormData((prev) => ({
      ...prev,
      ottApps: prev.ottApps.includes(app)
        ? prev.ottApps.filter((a) => a !== app)
        : [...prev.ottApps, app],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error(
          "Please fill in all required fields (First Name, Last Name, Email)"
        );
        setLoading(false);
        return;
      }

      // Build customer data - only include optional fields if they have values
      const customerData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        status: formData.status as "active" | "inactive" | "prospect",
        source: "website",
      };

      // Only include phone if it has a value
      if (formData.phone && formData.phone.trim()) {
        customerData.phone = formData.phone.trim();
      }

      // Only include company if it has a value
      if (formData.company && formData.company.trim()) {
        customerData.company = formData.company.trim();
      }

      // Only include address if at least one field has a value
      if (
        formData.street ||
        formData.city ||
        formData.state ||
        formData.zipCode
      ) {
        customerData.address = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        };
      }

      // Include ISP data
      customerData.ispData = {
        plan: {
          type: formData.planType as "Fiber" | "Broadband" | "Wireless",
          speed: formData.speed,
          price: formData.price,
          billingCycle: formData.billingCycle as
            | "Monthly"
            | "Quarterly"
            | "Annual",
          ottApps: formData.ottApps,
          liveChannels: formData.liveChannels,
        },
        usage: {
          dataConsumed: 0,
          averageSpeed: parseFloat(formData.speed),
          uptime: 99.5,
          mostUsedOTT: formData.ottApps,
          peakUsageHours: ["20:00-23:00"],
        },
        customerSince: new Date(),
        lifetimeValue: formData.price,
        churnRisk: "Low",
        npsScore: 50,
        tickets: 0,
        satisfaction: 5 as 1 | 2 | 3 | 4 | 5,
      };

      await createCustomer(customerData);

      toast.success("Customer created successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating customer:", error);
      // Error is already handled by axios interceptor
      // Only show additional error if needed
      if (!error.response) {
        toast.error("Failed to create customer");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Add New ISP Customer
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Address
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ISP Plan Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  ISP Plan Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Type
                    </label>
                    <select
                      name="planType"
                      value={formData.planType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Fiber">Fiber</option>
                      <option value="Broadband">Broadband</option>
                      <option value="Wireless">Wireless</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed
                    </label>
                    <select
                      name="speed"
                      value={formData.speed}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="50Mbps">50 Mbps</option>
                      <option value="100Mbps">100 Mbps</option>
                      <option value="200Mbps">200 Mbps</option>
                      <option value="500Mbps">500 Mbps</option>
                      <option value="1Gbps">1 Gbps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹/month)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      name="billingCycle"
                      value={formData.billingCycle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Channels
                    </label>
                    <input
                      type="number"
                      name="liveChannels"
                      value={formData.liveChannels}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* OTT Apps */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTT Apps
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Netflix",
                      "Amazon Prime",
                      "Disney+ Hotstar",
                      "SonyLIV",
                      "Zee5",
                    ].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => handleOttToggle(app)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          formData.ottApps.includes(app)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerModal;
