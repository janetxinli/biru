import axios from "axios";
import { getCookieHeader } from "../utils/getCookieHeader";

export const getAll = async (queryParams = null, token = null) => {
  return axios.get("http://localhost:3001/api/beer", {
    withCredentials: true,
    params: queryParams,
    ...(token && getCookieHeader(token)),
  });
};

export const getBeerById = async (id, token = null) => {
  return axios.get(`http://localhost:3001/api/beer/${id}`, {
    withCredentials: true,
    ...(token && getCookieHeader(token)),
  });
};

export const createBeer = async (newBeer, token = null) => {
  return axios.post("http://localhost:3001/api/beer", newBeer, {
    withCredentials: true,
    ...(token && getCookieHeader(token)),
  });
};

export const deleteBeer = async (id, token = null) => {
  return axios.delete(`http://localhost:3001/api/beer/${id}`, {
    withCredentials: true,
    ...(token && getCookieHeader(token)),
  });
};

export const editBeer = async (id, newBeer, token = null) => {
  return axios.put(`http://localhost:3001/api/beer/${id}`, newBeer, {
    withCredentials: true,
    ...(token && getCookieHeader(token)),
  });
};
