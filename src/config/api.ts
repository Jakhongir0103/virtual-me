const PORT = import.meta.env.VITE_PORT || 3000;
const API_URL = import.meta.env.PROD 
  ? 'https://virtual-assistant-backend-3699.onrender.com'
  : `http://localhost:8000`;

export { API_URL };