import axios from "axios";

export const getBeerById = async (id) =>
  axios.get(`${process.env.BACKEND_URL}/api/beer/${id}`, {
    withCredentials: true,
  });

export const createBeer = async (newBeer) =>
  axios.post(`${process.env.BACKEND_URL}/api/beer`, newBeer, {
    withCredentials: true,
  });

export const deleteBeer = async (id) =>
  axios.delete(`${process.env.BACKEND_URL}/api/beer/${id}`, {
    withCredentials: true,
  });

export const editBeer = async (id, newBeer) =>
  axios.put(`${process.env.BACKEND_URL}/api/beer/${id}`, newBeer, {
    withCredentials: true,
  });
