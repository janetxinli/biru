import axios from "axios";

export const searchUsers = async (q) =>
  axios.get(`${process.env.BACKEND_URL}/api/user/search`, {
    params: {
      q,
    },
    withCredentials: true,
  });

export const getProfile = async (username, queryParams) =>
  axios.get(`${process.env.BACKEND_URL}/api/user/${username}/profile`, {
    withCredentials: true,
    params: queryParams,
  });

export const editUser = async (id, imageUrl, name, bio) =>
  axios.post(
    `${process.env.BACKEND_URL}/api/user/${id}/edit`,
    {
      imageUrl,
      name,
      bio,
    },
    {
      withCredentials: true,
    }
  );

export const signup = async (username, password, name, bio) => {
  const newUser = { username, password, name, bio };
  return axios.post(`${process.env.BACKEND_URL}/api/user`, newUser, {
    withCredentials: true,
  });
};

export const getFollowing = async (id) =>
  axios.get(`${process.env.BACKEND_URL}/api/user/${id}/following`, {
    withCredentials: true,
  });

export const getFollowers = async (id) =>
  axios.get(`${process.env.BACKEND_URL}/api/user/${id}/followers`, {
    withCredentials: true,
  });

export const followUser = async (id) =>
  axios.post(
    `${process.env.BACKEND_URL}/api/user/${id}/follow`,
    {},
    {
      withCredentials: true,
    }
  );

export const unfollowUser = async (id) =>
  axios.post(
    `${process.env.BACKEND_URL}/api/user/${id}/unfollow`,
    {},
    {
      withCredentials: true,
    }
  );

export const getFeed = async (id, page) =>
  axios.get(`${process.env.BACKEND_URL}/api/user/${id}/feed`, {
    params: {
      page,
    },
    withCredentials: true,
  });
