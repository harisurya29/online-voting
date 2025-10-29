import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile')
};

// Election services
export const electionService = {
  getAll: () => api.get('/elections'),
  getById: (id) => api.get(`/elections/${id}`),
  create: (electionData) => api.post('/elections', electionData),
  update: (id, electionData) => api.put(`/elections/${id}`, electionData),
  delete: (id) => api.delete(`/elections/${id}`)
};

// Vote services
export const voteService = {
  castVote: (voteData) => api.post('/votes', voteData),
  getStats: (electionId) => api.get(`/votes/stats/${electionId}`),
  checkVoted: (electionId) => api.get(`/votes/check/${electionId}`)
};

export default api;