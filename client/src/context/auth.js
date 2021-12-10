import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

  const loginUser = async (newUser) => {
    setAuthenticated(true);
    setUser(newUser);
  };

  const logoutUser = async () => {
    setUser(null);
    setAuthenticated(false);
  };

  const contextObj = useMemo(
    () => ({
      authenticated,
      user,
      loginUser,
      logoutUser,
    }),
    []
  );

  return (
    <AuthContext.Provider value={contextObj}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
