import axios from "axios";

export const login = async (username, password) => {
  const user = { username, password };
  return axios.post("http://localhost:3001/api/auth/login", user, {
    withCredentials: true,
  });
};

export const logout = async () => {
  return axios.get("http://localhost:3001/api/auth/logout", {
    withCredentials: true,
  });
};

export const signup = async (username, password, name, bio) => {
  const newUser = { username, password, name, bio };
  return axios.post("http://localhost:3001/api/auth/signup", newUser, {
    withCredentials: true,
  });
};
