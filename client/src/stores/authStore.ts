import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user: User, token: string) => {
        // Store token in localStorage as well for API interceptor
        localStorage.setItem("token", token);
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");
        set({ isAuthenticated: false, user: null, token: null });
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
