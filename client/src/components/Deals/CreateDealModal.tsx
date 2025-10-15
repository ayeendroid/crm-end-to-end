import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import dealService, { DealFormData } from "../../services/dealService";
import customerService from "../../services/customerService";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<DealFormData>({
    title: "",
    description: "",
    customer: "",
    value: 0,
    stage: "prospecting",
    probability: 10,
    expectedCloseDate: "",
    assignedTo: "",
    tags: [],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch customers for dropdown
  const { data: customersData } = useQuery(
    ["customers", { limit: 1000 }],
    () => customerService.getCustomers({ limit: 1000 }),
    {
      enabled: isOpen,
    }
  );

  // Get current user from localStorage
  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFormData((prev) => ({ ...prev, assignedTo: user.id || user._id }));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, [isOpen]);

  // Create mutation
  const createMutation = useMutation(dealService.createDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries("deals");
      queryClient.invalidateQueries("dealStats");
      toast.success("Deal created successfully!");
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create deal";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    const userStr = localStorage.getItem("user");
    let assignedTo = "";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        assignedTo = user.id || user._id;
      } catch (e) {
        // ignore
      }
    }

    setFormData({
      title: "",
      description: "",
      customer: "",
      value: 0,
      stage: "prospecting",
      probability: 10,
      expectedCloseDate: "",
      assignedTo,
      tags: [],
      notes: "",
    });
    setTagInput("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.customer) {
      newErrors.customer = "Customer is required";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    } else {
      const closeDate = new Date(formData.expectedCloseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (closeDate < today) {
        newErrors.expectedCloseDate =
          "Expected close date cannot be in the past";
      }
    }

    if (
      formData.probability !== undefined &&
      (formData.probability < 0 || formData.probability > 100)
    ) {
      newErrors.probability = "Probability must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      createMutation.mutate(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tag),
    });
  };

  const handleStageChange = (stage: DealFormData["stage"]) => {
    let probability = formData.probability;

    // Auto-adjust probability based on stage
    switch (stage) {
      case "prospecting":
        probability = 10;
        break;
      case "qualification":
        probability = 25;
        break;
      case "proposal":
        probability = 50;
        break;
      case "negotiation":
        probability = 75;
        break;
      case "closed-won":
        probability = 100;
        break;
      case "closed-lost":
        probability = 0;
        break;
    }

    setFormData({ ...formData, stage, probability });
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Deal
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter deal title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.customer ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a customer</option>
                    {customersData?.customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.firstName} {customer.lastName}
                        {customer.company ? ` - ${customer.company}` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.customer && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customer}
                    </p>
                  )}
                </div>

                {/* Value and Stage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Value (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.value ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                      step="1000"
                    />
                    {errors.value && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.value}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        handleStageChange(
                          e.target.value as DealFormData["stage"]
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="prospecting">Prospecting</option>
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed-won">Closed Won</option>
                      <option value="closed-lost">Closed Lost</option>
                    </select>
                  </div>
                </div>

                {/* Probability and Expected Close Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (%) <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.probability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            probability: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-center text-sm font-semibold text-blue-600">
                        {formData.probability}%
                      </div>
                    </div>
                    {errors.probability && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.probability}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Close Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedCloseDate: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.expectedCloseDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.expectedCloseDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.expectedCloseDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter deal description"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isLoading ? "Creating..." : "Create Deal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDealModal;
