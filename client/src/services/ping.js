import axios from "axios";

const ping = async () =>
  axios.get(`${process.env.BACKEND_URL}/api/ping`, {
    withCredentials: true,
  });

export default ping;
