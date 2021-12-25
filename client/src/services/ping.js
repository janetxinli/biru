import axios from "axios";

const ping = async () =>
  axios.get("http://localhost:3001/api/ping", {
    withCredentials: true,
  });

export default ping;
