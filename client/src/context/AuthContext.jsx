import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try { setUser(await getMe()); } catch { localStorage.removeItem("token"); }
      }
      setLoading(false);
    };
    check();
  }, []);

  const login = (token, userData) => { localStorage.setItem("token", token); setUser(userData); };
  const logoutUser = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, logout: logoutUser }}>{children}</AuthContext.Provider>;
}