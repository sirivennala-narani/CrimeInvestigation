import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // allow ample time for Gemini mystery generation
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message === 'Network Error') {
      message = 'Unable to connect to the server. Please check your connection and ensure the backend is running.';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out while generating mystery. Please try again.';
    }
    return Promise.reject(new Error(message));
  }
);

/**
 * 15.1 Create a new mystery case
 */
export async function createCase(premise, difficulty) {
  const response = await apiClient.post('/cases', { premise, difficulty });
  return response.data;
}

/**
 * 15.2 Retrieve case state during investigation
 */
export async function getCase(id) {
  const response = await apiClient.get(`/cases/${id}`);
  return response.data;
}

/**
 * 15.3 Discover a specific clue
 */
export async function discoverClue(id, clueId) {
  const response = await apiClient.post(`/cases/${id}/clues/${clueId}/discover`);
  return response.data;
}

/**
 * 15.4 Request a hint
 */
export async function requestHint(id) {
  const response = await apiClient.post(`/cases/${id}/hints`);
  return response.data;
}

/**
 * 15.5 Submit an accusation
 */
export async function submitAccusation(id, suspectId) {
  const response = await apiClient.post(`/cases/${id}/accuse`, { suspectId });
  return response.data;
}

/**
 * 15.6 Retrieve final results
 */
export async function getResult(id) {
  const response = await apiClient.get(`/cases/${id}/result`);
  return response.data;
}

export default {
  createCase,
  getCase,
  discoverClue,
  requestHint,
  submitAccusation,
  getResult
};
