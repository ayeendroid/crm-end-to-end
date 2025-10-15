import React from "react";
import {
  Bell,
  Settings,
  User,
  Users,
  Menu,
  LogOut,
  Shield,
  CreditCard,
  Key,
  Search,
  Command,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick }) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global keyboard shortcut for Command Palette (Ctrl+K / Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchClick?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchClick]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu + Page title */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Dashboard
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Button */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              title="Search (Ctrl+K)"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Search
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold bg-purple-500 bg-opacity-30 border border-purple-400 border-opacity-30 rounded">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            {/* Users Badge - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">1</span>
            </div>

            {/* Online Badge - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-900">Online</span>
            </div>

            {/* Notifications - Modern */}
            <div className="relative">
              <button
                className="relative p-2.5 sm:p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 glass-card"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
            </div>

            {/* Notifications - Simple bell icon */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Company selector - Hidden on smaller screens */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  BHARATNET
                </p>
                <p className="text-xs text-gray-500 truncate">Private Ltd</p>
              </div>
            </div>

            {/* User profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="User menu"
                aria-expanded={isProfileOpen}
              >
                <div className="relative">
                  <img
                    src="https://crm.bharatnett.com/backend/img/default_photo.jpg"
                    alt="User avatar"
                    className="h-9 w-9 rounded-lg object-cover ring-2 ring-gray-200"
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[100px]">
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 animate-slideIn z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://crm.bharatnett.com/backend/img/default_photo.jpg"
                        alt="User avatar"
                        className="h-12 w-12 rounded-lg ring-2 ring-white object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          Anmol Singhal
                        </p>
                        <p className="text-xs text-purple-100 truncate">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Settings className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-medium">Admin Accounts</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">License</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Key className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-medium">Change Password</span>
                    </button>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
