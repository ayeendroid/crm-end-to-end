import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Command,
  Users,
  Target,
  DollarSign,
  FileText,
  Building2,
  MapPin,
  Hash,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "customer" | "lead" | "deal" | "invoice" | "location" | "gst";
  title: string;
  subtitle: string;
  description?: string;
  metadata?: string;
  icon: any;
  action: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

  // Mock data with Indian context
  const mockData: SearchResult[] = [
    {
      id: "1",
      type: "customer",
      title: "Himalayan Tech Solutions",
      subtitle: "Dehradun, Uttarakhand",
      description: "Premium Customer • ₹15L Revenue",
      metadata: "Customer since Jan 2024",
      icon: Building2,
      action: "/customers/1",
    },
    {
      id: "2",
      type: "customer",
      title: "Mountain View Enterprises",
      subtitle: "Haridwar, Uttarakhand",
      description: "Active • ₹8.5L Revenue",
      metadata: "GST: 05ABCDE1234F1Z5",
      icon: Building2,
      action: "/customers/2",
    },
    {
      id: "3",
      type: "customer",
      title: "Ganga Valley Industries",
      subtitle: "Rishikesh, Uttarakhand",
      description: "Standard Customer • ₹5.2L Revenue",
      metadata: "+91 98765 43210",
      icon: Building2,
      action: "/customers/3",
    },
    {
      id: "4",
      type: "lead",
      title: "Uttarakhand Startup Hub",
      subtitle: "New Lead • High Priority",
      description: "AI Score: 92 • Dehradun",
      metadata: "Source: Website",
      icon: Target,
      action: "/leads/4",
    },
    {
      id: "5",
      type: "lead",
      title: "Char Dham Tourism Co.",
      subtitle: "Qualified Lead",
      description: "AI Score: 85 • Interested in Premium Plan",
      metadata: "Contact: Rajesh Kumar",
      icon: Target,
      action: "/leads/5",
    },
    {
      id: "6",
      type: "deal",
      title: "Enterprise Plan - Mussoorie Hotels",
      subtitle: "Negotiation Stage",
      description: "₹25L • 75% Probability",
      metadata: "Close Date: Nov 30, 2025",
      icon: DollarSign,
      action: "/deals/6",
    },
    {
      id: "7",
      type: "deal",
      title: "Annual Contract - Nainital Resort",
      subtitle: "Proposal Sent",
      description: "₹12L • 60% Probability",
      metadata: "Decision Maker: Priya Sharma",
      icon: DollarSign,
      action: "/deals/7",
    },
    {
      id: "8",
      type: "invoice",
      title: "INV-2025-001",
      subtitle: "Paid • ₹5,00,000",
      description: "Himalayan Tech Solutions",
      metadata: "Date: Oct 1, 2025",
      icon: FileText,
      action: "/invoices/8",
    },
    {
      id: "9",
      type: "location",
      title: "Dehradun Office",
      subtitle: "Uttarakhand",
      description: "15 Active Customers",
      metadata: "Rajpur Road, Dehradun - 248001",
      icon: MapPin,
      action: "/locations/dehradun",
    },
    {
      id: "10",
      type: "location",
      title: "Haridwar Branch",
      subtitle: "Uttarakhand",
      description: "8 Active Customers",
      metadata: "Near Har Ki Pauri, Haridwar - 249401",
      icon: MapPin,
      action: "/locations/haridwar",
    },
    {
      id: "11",
      type: "gst",
      title: "GST Report - Q3 2025",
      subtitle: "Uttarakhand",
      description: "Total GST: ₹2,45,000",
      metadata: "CGST: ₹1,22,500 | SGST: ₹1,22,500",
      icon: Hash,
      action: "/reports/gst",
    },
    {
      id: "12",
      type: "customer",
      title: "Dev Bhoomi Software",
      subtitle: "Haldwani, Uttarakhand",
      description: "Growing Account • ₹6.8L Revenue",
      metadata: "Contact: Vikram Singh",
      icon: Building2,
      action: "/customers/12",
    },
  ];

  // Fuzzy search implementation
  const fuzzySearch = useCallback((query: string, data: SearchResult[]) => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return data
      .filter((item) => {
        const searchableText =
          `${item.title} ${item.subtitle} ${item.description} ${item.metadata}`.toLowerCase();

        // Check if query words are present
        const queryWords = lowerQuery.split(" ");
        return queryWords.every((word) => searchableText.includes(word));
      })
      .sort((a, b) => {
        // Prioritize matches in title
        const aScore = a.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
        const bScore = b.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
        return bScore - aScore;
      });
  }, []);

  // Update search results
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = fuzzySearch(searchQuery, mockData);
      setResults(filtered.slice(0, 8)); // Show top 8 results
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [searchQuery, fuzzySearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== result.id);
      return [result, ...filtered].slice(0, 5);
    });

    // Navigate to result (in real app, use router)
    console.log("Navigate to:", result.action);
    onClose();
  };

  // Quick actions
  const quickActions = [
    {
      icon: Users,
      label: "New Customer",
      action: "/customers/new",
      color: "blue",
    },
    { icon: Target, label: "New Lead", action: "/leads/new", color: "purple" },
    {
      icon: DollarSign,
      label: "New Deal",
      action: "/deals/new",
      color: "green",
    },
    {
      icon: FileText,
      label: "New Invoice",
      action: "/invoices/new",
      color: "orange",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-slideDown">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search customers, leads, deals, locations... (Try: Dehradun, GST, Himalayan)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-lg placeholder-gray-400"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
              Esc
            </kbd>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto">
          {/* Search Results */}
          {searchQuery.trim() && results.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Search Results ({results.length})
              </div>
              {results.map((result, index) => {
                const Icon = result.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        result.type === "customer"
                          ? "bg-blue-100"
                          : result.type === "lead"
                          ? "bg-purple-100"
                          : result.type === "deal"
                          ? "bg-green-100"
                          : result.type === "invoice"
                          ? "bg-orange-100"
                          : result.type === "location"
                          ? "bg-pink-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          result.type === "customer"
                            ? "text-blue-600"
                            : result.type === "lead"
                            ? "text-purple-600"
                            : result.type === "deal"
                            ? "text-green-600"
                            : result.type === "invoice"
                            ? "text-orange-600"
                            : result.type === "location"
                            ? "text-pink-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {result.title}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === "customer"
                              ? "bg-blue-100 text-blue-700"
                              : result.type === "lead"
                              ? "bg-purple-100 text-purple-700"
                              : result.type === "deal"
                              ? "bg-green-100 text-green-700"
                              : result.type === "invoice"
                              ? "bg-orange-100 text-orange-700"
                              : result.type === "location"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{result.subtitle}</p>
                      {result.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {result.description}
                        </p>
                      )}
                      {result.metadata && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {result.metadata}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {searchQuery.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No results found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching for customers, deals, or locations in Uttarakhand
              </p>
            </div>
          )}

          {/* Default View (No Search) */}
          {!searchQuery.trim() && (
            <>
              {/* Quick Actions */}
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.action}
                        onClick={() => {
                          console.log("Navigate to:", action.action);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg bg-${action.color}-100`}
                        >
                          <Icon
                            className={`h-5 w-5 text-${action.color}-600`}
                          />
                        </div>
                        <span className="font-medium text-gray-700">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                  {recentSearches.map((result) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tips */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Command className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Search Tips:</p>
                    <ul className="space-y-0.5 text-gray-500">
                      <li>• Search by customer name, city, or GST number</li>
                      <li>
                        • Use{" "}
                        <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">
                          Ctrl+K
                        </kbd>{" "}
                        or{" "}
                        <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">
                          Cmd+K
                        </kbd>{" "}
                        to open
                      </li>
                      <li>• Use arrow keys to navigate, Enter to select</li>
                      <li>• Try: "Dehradun", "GST", "Himalayan", "₹"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;
