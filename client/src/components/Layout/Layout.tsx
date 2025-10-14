import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CommandPalette from "../CommandPalette/CommandPalette";
import { useCommandPaletteStore } from "../../stores/commandPaletteStore";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOpen, openCommandPalette, closeCommandPalette } =
    useCommandPaletteStore();

  // Close sidebar when clicking on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Command Palette */}
      <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 w-full lg:ml-64 min-w-0">
        {/* Header - Fixed at top */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={openCommandPalette}
        />

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
