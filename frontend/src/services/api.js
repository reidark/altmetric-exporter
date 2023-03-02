import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.API_URL || "https://altmetric-exporter-backend.onrender.com",
});

export default api;
