import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("auth");
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error - Backend not reachable at", API_BASE_URL);
      return Promise.reject({
        response: {
          data: {
            error: "Cannot connect to server. Please ensure backend is running on http://localhost:5001",
          },
        },
      });
    }

    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  updatePassword: (data) => api.post("/auth/update-password", data),
};

export const storesAPI = {
  getAllStores: (params) => api.get("/stores/admin/all", { params }),
  getStoresForUser: (params) => api.get("/stores/user/list", { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post("/stores", data),
  deleteStore: (id) => api.delete(`/stores/${id}`),
};

export const ratingsAPI = {
  submitRating: (data) => api.post("/ratings/submit", data),
  getUserRating: (storeId) => api.get(`/ratings/user/${storeId}`),
  getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`),
  getAllRatings: () => api.get("/ratings/admin/all"),
};

export const usersAPI = {
  createUser: (data) => api.post("/users", data),
  getAllUsers: (params) => api.get("/users/all", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  getDashboardStats: () => api.get("/users/dashboard"),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
