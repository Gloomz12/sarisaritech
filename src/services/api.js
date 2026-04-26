import axios from 'axios';

// Create an instance of axios with default settings
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Your Python Backend URL
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;