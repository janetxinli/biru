import axios from "axios";

export const login = async (username, password) => {
  const user = { username, password };
  return axios.post(`${process.env.BACKEND_URL}/api/auth/login`, user, {
    withCredentials: true,
  });
};

export const logout = async () =>
  axios.get(`${process.env.BACKEND_URL}/api/auth/logout`, {
    withCredentials: true,
  });

export const checkAuthStatus = async () =>
  axios.get(`${process.env.BACKEND_URL}/api/auth/check`, {
    withCredentials: true,
  });
