const PORT = import.meta.env.VITE_PORT || 3000;
export const API_URL = import.meta.env.PROD 
  ? 'https://virtual-assistant-backend-3699.onrender.com'  // Replace with your Render backend URL
  : `http://localhost:${import.meta.env.VITE_API_URL || 8000}`;