// This is the "brain" of your frontend. It manages the user state and persists the token in localStorage so they don't have to log in again if they refresh the page.
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial boot
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // If data is corrupt, clear it out
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // const login = (userData: any, newToken: string) => {
  //   // 1. Update State (This triggers the UI re-render immediately)
  //   setToken(newToken);
  //   setUser(userData);

  //   // 2. Persist to LocalStorage (This handles the refresh later)
  //   localStorage.setItem("token", newToken);
  //   localStorage.setItem("user", JSON.stringify(userData));
  // };

  // Inside AuthContext.tsx
  const login = (userData: any, newToken: string) => {
    // 1. Set local storage first so it's there if the page glitches
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // 2. Update state IMMEDIATELY
    // Using the spread operator ensures React sees a "new" object and re-renders
    setToken(newToken);
    setUser({ ...userData });
  };

  // const logout = () => {
  //   setToken(null);
  //   setUser(null);
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  // };

  // Inside your AuthContext.tsx logout function
  const logout = async () => {
    try {
      // 1. (Optional) Tell the backend we are leaving
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout notification failed", err);
    } finally {
      // 2. The CRITICAL part: Clear the state and storage
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 3. Redirect to home or login
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
