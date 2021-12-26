import axios from "axios";

const uploadImage = async (encoded) => {
  // create FormData object with image
  const form = new FormData();

  form.append("image", encoded);

  return axios.post("http://localhost:3001/api/image/upload", form, {
    withCredentials: true,
  });
};

export default uploadImage;
