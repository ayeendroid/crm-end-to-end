import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

// Layout Components
import Layout from "./components/Layout/Layout";
import CommandPalette from "./components/CommandPalette";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Dashboard from "./pages/Dashboard";
import PipelineView from "./pages/PipelineView";
import Customer360View from "./pages/Customer360View";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

// Hooks and Stores
import { useAuthStore } from "./stores/authStore";
import { useCommandPaletteStore } from "./stores/commandPaletteStore";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      refetchOnMount: false, // Don't refetch on component mount if data exists
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();
  const { isOpen, openCommandPalette, closeCommandPalette } =
    useCommandPaletteStore();

  // Command Palette Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            {/* Command Palette */}
            <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />

            <Routes>
              {!isAuthenticated ? (
                <Route path="*" element={<Login />} />
              ) : (
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="pipeline" element={<PipelineView />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="customers/:id" element={<Customer360View />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>
              )}
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
