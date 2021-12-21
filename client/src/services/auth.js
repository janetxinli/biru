import axios from "axios";

export const login = async (username, password) => {
  const user = { username, password };
  return axios.post("http://localhost:3001/api/auth/login", user, {
    withCredentials: true,
  });
};

export const logout = async () =>
  axios.get("http://localhost:3001/api/auth/logout", {
    withCredentials: true,
  });

export const checkAuthStatus = async () =>
  axios.get("http://localhost:3001/api/auth/check", {
    withCredentials: true,
  });
