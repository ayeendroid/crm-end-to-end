import React from "react";
import { Deal } from "../../services/dealService";
import {
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Tag,
  FileText,
} from "lucide-react";

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({
  isOpen,
  onClose,
  deal,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !deal) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600";
    if (probability >= 50) return "text-yellow-600";
    if (probability >= 25) return "text-orange-600";
    return "text-red-600";
  };

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
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {deal.title}
                </h3>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStageColor(
                    deal.stage
                  )}`}
                >
                  {deal.stage.replace("-", " ").toUpperCase()}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Deal Value</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(deal.value)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Probability</span>
                </div>
                <div
                  className={`text-2xl font-bold ${getProbabilityColor(
                    deal.probability
                  )}`}
                >
                  {deal.probability}%
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expected Close</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(deal.expectedCloseDate)}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium text-gray-900">
                      {deal.customer.firstName} {deal.customer.lastName}
                    </div>
                  </div>
                  {deal.customer.company && (
                    <div>
                      <div className="text-sm text-gray-600">Company</div>
                      <div className="font-medium text-gray-900">
                        {deal.customer.company}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">
                      {deal.customer.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Deal Information
              </h4>
              <div className="space-y-3">
                {deal.description && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Description
                    </div>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {deal.description}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Assigned To
                    </div>
                    <div className="font-medium text-gray-900">
                      {deal.assignedTo.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Created On</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(deal.createdAt)}
                    </div>
                  </div>
                </div>

                {deal.actualCloseDate && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Actual Close Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDate(deal.actualCloseDate)}
                    </div>
                  </div>
                )}

                {deal.lostReason && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Lost Reason
                    </div>
                    <div className="text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                      {deal.lostReason}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {deal.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Notes
                </h4>
                <div className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {deal.notes}
                </div>
              </div>
            )}

            {/* Products */}
            {deal.products && deal.products.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Products
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Discount
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deal.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {product.productId}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {formatCurrency(product.unitPrice)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {product.discount}%
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(
                              product.quantity *
                                product.unitPrice *
                                (1 - product.discount / 100)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Activities */}
            {deal.activities && deal.activities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Activities
                </h4>
                <div className="text-sm text-gray-600">
                  {deal.activities.length} activities linked to this deal
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <div className="flex gap-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Deal
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Deal
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;
