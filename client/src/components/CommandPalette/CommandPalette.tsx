import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  UserPlus,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  TrendingUp,
  Users,
  Settings,
  X,
  ArrowRight,
  Clock,
  Star,
  Zap,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  category: "action" | "navigation" | "recent";
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sample commands - in real app, these would come from your app state/API
  const allCommands: CommandItem[] = [
    // Quick Actions
    {
      id: "new-customer",
      title: "Add New Subscriber",
      subtitle: "Register a new internet subscriber",
      icon: <UserPlus className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to add subscriber");
        onClose();
      },
      keywords: [
        "subscriber",
        "customer",
        "client",
        "add",
        "new",
        "create",
        "connection",
      ],
    },
    {
      id: "new-deal",
      title: "Process Plan Upgrade",
      subtitle: "Upgrade subscriber to higher plan",
      icon: <TrendingUp className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to plan upgrade");
        onClose();
      },
      keywords: ["upgrade", "plan", "deal", "speed", "new", "create"],
    },
    {
      id: "new-task",
      title: "Create Support Ticket",
      subtitle: "Log a customer support issue",
      icon: <CheckSquare className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to add support ticket");
        onClose();
      },
      keywords: [
        "ticket",
        "support",
        "issue",
        "problem",
        "task",
        "todo",
        "reminder",
        "new",
        "create",
      ],
    },
    {
      id: "schedule-meeting",
      title: "Schedule Site Survey",
      subtitle: "Book technician for site visit",
      icon: <Calendar className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to schedule site survey");
        onClose();
      },
      keywords: [
        "survey",
        "site",
        "technician",
        "meeting",
        "schedule",
        "calendar",
        "appointment",
        "installation",
      ],
    },
    {
      id: "send-email",
      title: "Send Email",
      subtitle: "Compose and send an email",
      icon: <Mail className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to send email");
        onClose();
      },
      keywords: ["email", "send", "compose", "message"],
    },
    {
      id: "log-call",
      title: "Log Phone Call",
      subtitle: "Record a call activity",
      icon: <Phone className="w-5 h-5" />,
      category: "action",
      action: () => {
        console.log("Navigate to log call");
        onClose();
      },
      keywords: ["call", "phone", "log", "activity"],
    },

    // Navigation
    {
      id: "nav-dashboard",
      title: "Dashboard",
      subtitle: "Go to dashboard",
      icon: <Zap className="w-5 h-5" />,
      category: "navigation",
      action: () => {
        console.log("Navigate to dashboard");
        onClose();
      },
      keywords: ["dashboard", "home", "overview"],
    },
    {
      id: "nav-customers",
      title: "Customers",
      subtitle: "View all customers",
      icon: <Users className="w-5 h-5" />,
      category: "navigation",
      action: () => {
        console.log("Navigate to customers");
        onClose();
      },
      keywords: ["customers", "clients", "contacts"],
    },
    {
      id: "nav-deals",
      title: "Deals",
      subtitle: "View sales pipeline",
      icon: <TrendingUp className="w-5 h-5" />,
      category: "navigation",
      action: () => {
        console.log("Navigate to deals");
        onClose();
      },
      keywords: ["deals", "pipeline", "sales", "opportunities"],
    },
    {
      id: "nav-settings",
      title: "Settings",
      subtitle: "Configure your CRM",
      icon: <Settings className="w-5 h-5" />,
      category: "navigation",
      action: () => {
        console.log("Navigate to settings");
        onClose();
      },
      keywords: ["settings", "preferences", "config"],
    },

    // Recent Items (mock data)
    {
      id: "recent-rahul",
      title: "Rahul Sharma - Mumbai Subscriber",
      subtitle: "Opened 2 hours ago",
      icon: <Clock className="w-5 h-5" />,
      category: "recent",
      action: () => {
        console.log("Navigate to Rahul Sharma subscriber");
        onClose();
      },
      keywords: ["rahul", "sharma", "subscriber", "recent"],
    },
    {
      id: "recent-priya",
      title: "Priya Kumar - Fiber 1Gbps",
      subtitle: "Opened yesterday",
      icon: <Clock className="w-5 h-5" />,
      category: "recent",
      action: () => {
        console.log("Navigate to Priya Kumar subscriber");
        onClose();
      },
      keywords: ["priya", "kumar", "fiber", "recent"],
    },
  ];

  // Filter commands based on search query
  const filteredCommands = searchQuery
    ? allCommands.filter((cmd) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          cmd.title.toLowerCase().includes(searchLower) ||
          cmd.subtitle?.toLowerCase().includes(searchLower) ||
          cmd.keywords?.some((kw) => kw.includes(searchLower))
        );
      })
    : allCommands;

  // Group commands by category
  const groupedCommands = {
    action: filteredCommands.filter((cmd) => cmd.category === "action"),
    navigation: filteredCommands.filter((cmd) => cmd.category === "navigation"),
    recent: filteredCommands.filter((cmd) => cmd.category === "recent"),
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const renderCommandGroup = (
    title: string,
    commands: CommandItem[],
    icon: React.ReactNode
  ) => {
    if (commands.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {icon}
          <span>{title}</span>
        </div>
        <div className="space-y-1">
          {commands.map((cmd) => {
            const globalIndex = filteredCommands.indexOf(cmd);
            const isSelected = globalIndex === selectedIndex;

            return (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(globalIndex)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-2 border-purple-500"
                    : "hover:bg-gray-50 border-l-2 border-transparent"
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all duration-150 ${
                    isSelected
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{cmd.title}</div>
                  {cmd.subtitle && (
                    <div className="text-sm text-gray-500 truncate">
                      {cmd.subtitle}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <ArrowRight className="w-4 h-4 text-purple-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-10 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for actions, navigation, or recent items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Commands List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
        >
          {filteredCommands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-base font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for something else
              </p>
            </div>
          ) : (
            <>
              {renderCommandGroup(
                "Quick Actions",
                groupedCommands.action,
                <Zap className="w-3.5 h-3.5" />
              )}
              {renderCommandGroup(
                "Navigation",
                groupedCommands.navigation,
                <ArrowRight className="w-3.5 h-3.5" />
              )}
              {renderCommandGroup(
                "Recent",
                groupedCommands.recent,
                <Clock className="w-3.5 h-3.5" />
              )}
            </>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                ↵
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                ESC
              </kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Star className="w-3.5 h-3.5" />
            <span>Pro tip: Press Ctrl+K anywhere</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
