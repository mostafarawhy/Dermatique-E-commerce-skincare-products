import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.name === "CanceledError" || error.name === "AbortError") {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export default api;
