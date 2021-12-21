import axios from "axios";

export const searchUsers = async (q) =>
  axios.get("http://localhost:3001/api/user/search", {
    params: {
      q,
    },
    withCredentials: true,
  });

export const getProfile = async (username, queryParams) =>
  axios.get(`http://localhost:3001/api/user/${username}/profile`, {
    withCredentials: true,
    params: queryParams,
  });
