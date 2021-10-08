import axios from "axios";

export const getAll = async (queryParams = null) => {
  return axios.get("http://localhost:3001/api/beer", { params: queryParams });
};

export const getBeerById = async (id) => {
  return axios.get(`http://localhost:3001/api/beer/${id}`);
};
