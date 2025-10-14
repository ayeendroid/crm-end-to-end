import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  DollarSign,
  BarChart3,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
  CreditCard,
  Target,
  Router,
  FileText,
  HelpCircle,
  ClipboardList,
  Box,
  Globe,
  Wrench,
  Wifi,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  name: string;
  href: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  badge?: string;
  children?: SubMenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Dashboard"]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const navigation: MenuItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Visual Pipeline",
      href: "/pipeline",
      icon: Target,
      badge: "New",
    },
    {
      name: "Users & Packages",
      icon: Users,
      children: [
        { name: "User Management", href: "/users" },
        { name: "Search Users", href: "/users/search" },
        { name: "Document Management", href: "/users/documents" },
        { name: "Usage Packages", href: "/packages/usage" },
        { name: "OTT Packages", href: "/packages/ott" },
        { name: "IPTV Packages", href: "/packages/iptv" },
        { name: "Voice Packages", href: "/packages/voice" },
        { name: "Bandwidth", href: "/packages/bandwidth" },
      ],
    },
    {
      name: "Monitoring",
      icon: Activity,
      badge: "1",
      children: [
        { name: "Active Sessions", href: "/monitoring/sessions" },
        { name: "Completed Sessions", href: "/monitoring/completed" },
        { name: "Traffic Graphs", href: "/monitoring/traffic" },
        { name: "System Status", href: "/monitoring/status" },
      ],
    },
    {
      name: "Billing",
      icon: CreditCard,
      children: [
        { name: "Products", href: "/billing/products" },
        { name: "Plans", href: "/billing/plans" },
        { name: "Invoices", href: "/billing/invoices" },
        { name: "Payments", href: "/billing/payments" },
        { name: "Orders", href: "/billing/orders" },
        { name: "Credit Notes", href: "/billing/credit-notes" },
        { name: "Pay As You Go", href: "/billing/prepaid" },
        { name: "Billing Configuration", href: "/billing/config" },
      ],
    },
    {
      name: "Payment Collection",
      icon: DollarSign,
      children: [
        { name: "TDS Payments", href: "/payments/tds" },
        { name: "Cheque Payments", href: "/payments/cheque" },
        { name: "Cash Payments", href: "/payments/cash" },
        { name: "Collection Users", href: "/payments/users" },
        { name: "Collection Approval", href: "/payments/approval" },
      ],
    },
    {
      name: "Leads",
      icon: Target,
      children: [
        { name: "Lead Dashboard", href: "/leads/dashboard" },
        { name: "Lead Management", href: "/leads" },
        { name: "Lead Configuration", href: "/leads/config" },
        { name: "Completed Leads", href: "/leads/completed" },
        { name: "Dropped Leads", href: "/leads/dropped" },
        { name: "Lead SLA", href: "/leads/sla" },
      ],
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UserPlus,
    },
    {
      name: "Deals",
      href: "/deals",
      icon: DollarSign,
    },
    {
      name: "HelpDesk",
      icon: HelpCircle,
      children: [
        { name: "Dashboard", href: "/helpdesk/dashboard" },
        { name: "Tickets", href: "/helpdesk/tickets" },
        { name: "Completed Tickets", href: "/helpdesk/completed" },
        { name: "TAT Tickets", href: "/helpdesk/tat" },
        { name: "Ticket Configuration", href: "/helpdesk/config" },
        { name: "Ticket SLA", href: "/helpdesk/sla" },
      ],
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Inventory",
      icon: Box,
      children: [
        { name: "Inventory Dashboard", href: "/inventory/dashboard" },
        { name: "Stock Overview", href: "/inventory/stock" },
        { name: "Items", href: "/inventory/items" },
        { name: "Vendor Management", href: "/inventory/vendors" },
        { name: "Locations", href: "/inventory/locations" },
      ],
    },
    {
      name: "Router Config",
      icon: Router,
      children: [
        { name: "Routers", href: "/routers" },
        { name: "IP Management", href: "/routers/ip" },
        { name: "OLT and CPE Devices", href: "/routers/devices" },
      ],
    },
    {
      name: "Network Settings",
      icon: Wifi,
      children: [
        { name: "Interface", href: "/network/interface" },
        { name: "VLANs", href: "/network/vlans" },
        { name: "DHCP", href: "/network/dhcp" },
        { name: "Routing & NAT", href: "/network/routing" },
        { name: "SNMP", href: "/network/snmp" },
      ],
    },
    {
      name: "External Integration",
      icon: Globe,
      children: [
        { name: "SMS", href: "/integration/sms" },
        { name: "Email", href: "/integration/email" },
        { name: "WhatsApp", href: "/integration/whatsapp" },
        { name: "Payment Gateway", href: "/integration/payment" },
        { name: "FTP", href: "/integration/ftp" },
        { name: "Google Drive", href: "/integration/drive" },
        { name: "WebHooks", href: "/integration/webhooks" },
      ],
    },
    {
      name: "Reporting",
      icon: FileText,
      children: [
        { name: "Reports", href: "/reports" },
        { name: "Schedule Report", href: "/reports/schedule" },
      ],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Logs",
      icon: FileText,
      children: [
        { name: "Event Logs", href: "/logs/events" },
        { name: "User Logs", href: "/logs/users" },
        { name: "SMS Logs", href: "/logs/sms" },
        { name: "Email Logs", href: "/logs/email" },
        { name: "Payment Logs", href: "/logs/payments" },
        { name: "NAT Logs", href: "/logs/nat" },
      ],
    },
    {
      name: "System Tools",
      icon: Wrench,
      children: [
        { name: "System Status", href: "/system/status" },
        { name: "Backup/Restore", href: "/system/backup" },
        { name: "Update", href: "/system/update" },
        { name: "Certificates", href: "/system/certificates" },
      ],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 lg:hidden z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-smooth"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-base font-bold text-gray-900 truncate">
                BharatNet CRM
              </h2>
              <p className="text-xs text-gray-500 truncate">Private Ltd</p>
            </div>
          </div>
        </div>

        {/* Navigation - Custom scrollbar */}
        <nav
          className="flex-1 overflow-y-auto py-3 custom-scrollbar"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="px-2 space-y-0.5">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="w-full group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                      <span className="flex-1 text-left text-truncate">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {item.badge}
                        </span>
                      )}
                      {expandedMenus.includes(item.name) ? (
                        <ChevronDown className="ml-2 h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="ml-2 h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedMenus.includes(item.name) && (
                      <div className="mt-1 space-y-0.5 ml-2 pl-6 border-l-2 border-gray-200">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            className={({ isActive }) =>
                              `group flex items-center pl-3 pr-3 py-2 text-sm font-medium rounded-lg transition-smooth ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`
                            }
                            onClick={() => onClose()}
                          >
                            <span className="text-truncate">{child.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.href!}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }`
                    }
                    onClick={() => onClose()}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User info - Fixed at bottom */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-semibold text-sm">AS</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 text-truncate">
                Anmol Singhal
              </p>
              <p className="text-xs text-gray-500 text-truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
