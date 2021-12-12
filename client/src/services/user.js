import axios from "axios";

// eslint-disable-next-line import/prefer-default-export
export const searchUsers = async (q) =>
  axios.get("http://localhost:3001/api/user/search", {
    params: {
      q,
    },
    withCredentials: true,
  });
