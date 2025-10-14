import React from "react";
import Modal from "./Modal";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

/**
 * Confirm Dialog Component
 *
 * Used for confirmations like:
 * - Delete customer
 * - Archive deal
 * - Cancel action
 * - Logout
 *
 * Supports bilingual messages (Hindi + English)
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    // Don't auto-close, let parent handle it after async operation
  };

  // Icon and color based on type
  const typeConfig = {
    danger: {
      icon: XCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="sm:flex sm:items-start">
        {/* Icon */}
        <div
          className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.bgColor} sm:mx-0 sm:h-10 sm:w-10`}
        >
          <Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`
            inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm
            sm:w-auto
            ${config.buttonColor}
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            confirmText
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="
            mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
            hover:bg-gray-50
            sm:mt-0 sm:w-auto
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
