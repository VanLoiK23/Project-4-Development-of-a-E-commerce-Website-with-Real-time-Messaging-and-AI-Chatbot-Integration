"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { getAccount } from "@/api/auth";
export const AuthContext = createContext({
  auth: {
    isAuthenticated: false,
    user: { email: "", name: "", role: "" },
  },
  setAuth: () => { },
  isAppLoading: true,
});

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: "", name: "", role: "" },
  });
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const {data} = getAccount();

          if (data) {
            setAuth({
              isAuthenticated: true,
              user: {
                ...data,
                name: data.fullName || `${data.firstName} ${data.lastName}`,
              },
            });
          }
        } catch (error) {
          console.error("Fetch account failed:", error);
          localStorage.removeItem("access_token");
        }
      }
      setIsAppLoading(false);
    };

    fetchAccount();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAppLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);