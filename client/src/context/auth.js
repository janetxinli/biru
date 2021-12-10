import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { checkAuthStatus } from "../services/auth";

const AuthContext = createContext({
  authenticated: false,
  user: null,
});

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const res = await checkAuthStatus();
      setAuthenticated(res.data.authenticated);

      if (res.data.user) {
        setUser(res.data.user);
      }

      setLoading(false);
    };

    initializeAuth();
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
    [authenticated, user]
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
