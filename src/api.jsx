// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // ✅ yahi kaam karega ab
});
console.log("Backend URL:", process.env.REACT_APP_API_URL);


export default api;
