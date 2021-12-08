import React, { createContext, useContext, useEffect, useState } from "react";
import { check } from "../services/auth";

const AuthContext = createContext({
  authenticated: false,
  user: null,
});

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("checking auth status");
    const checkAuthStatus = async () => {
      const res = await check();
      setAuthenticated(res.data.authenticated);

      if (res.data.user) {
        setUser(res.data.user);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const loginUser = async (user) => {
    setAuthenticated(true);
    setUser(user);
  };

  const logoutUser = async (user) => {
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, user, loginUser, logoutUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
