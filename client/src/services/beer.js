import axios from "axios";
  
export const getBeerById = async (id) =>
  axios.get(`http://localhost:3001/api/beer/${id}`, {
    withCredentials: true,
  });

export const createBeer = async (newBeer) =>
  axios.post("http://localhost:3001/api/beer", newBeer, {
    withCredentials: true,
  });

export const deleteBeer = async (id) =>
  axios.delete(`http://localhost:3001/api/beer/${id}`, {
    withCredentials: true,
  });

export const editBeer = async (id, newBeer) =>
  axios.put(`http://localhost:3001/api/beer/${id}`, newBeer, {
    withCredentials: true,
  });
