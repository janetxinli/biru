import axios from "axios";
import { getCookieHeader } from "../utils/getCookieHeader";

export const uploadImage = async (encoded, token = null) => {
  // create FormData object with image
  const form = new FormData();

  form.append("image", encoded);

  return axios.post("http://localhost:3001/api/image/upload", form, {
    withCredentials: true,
    ...(token && getCookieHeader(token)),
  });
};
