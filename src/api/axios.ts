import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // your ngrok url
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
