import axios from "axios";

const uploadImage = async (encoded) => {
  // create FormData object with image
  const form = new FormData();

  form.append("image", encoded);

  return axios.post(`${process.env.BACKEND_URL}/api/image/upload`, form, {
    withCredentials: true,
  });
};

export default uploadImage;
