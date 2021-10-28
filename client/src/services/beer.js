import axios from "axios";

export const getAll = async (queryParams = null) => {
  return axios.get("http://localhost:3001/api/beer", { params: queryParams });
};

export const getBeerById = async (id) => {
  return axios.get(`http://localhost:3001/api/beer/${id}`);
};

export const createBeer = async (newBeer) => {
  return axios.post("http://localhost:3001/api/beer", newBeer);
};

export const deleteBeer = async (id) => {
  return axios.delete(`http://localhost:3001/api/beer/${id}`);
};

export const editBeer = async (id, newBeer) => {
  return axios.put(`http://localhost:3001/api/beer/${id}`, newBeer);
};
