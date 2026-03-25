import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach JWT token to every request if present
API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getDashboard = () => API.get("/dashboard");
export const getRunway = () => API.get("/runway");
export const getDecision = () => API.get("/decision");
export const simulate = (data) => API.post("/simulate", data);
export const generateEmail = (data) => API.post("/generate-email", data);
export const getReports = (params) => API.get("/reports", { params });
export const uploadCSV = (file) => {
  const form = new FormData();
  form.append("file", file);
  return API.post("/upload/csv", form);
};
export const uploadImage = (file) => {
  const form = new FormData();
  form.append("file", file);
  return API.post("/upload/image", form);
};

export default API;
