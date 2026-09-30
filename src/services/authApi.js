import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
export const requestOtp = (phone) => api.post('/auth/otp/request', { phone });
export const verifyOtp = (phone, otp) => api.post('/auth/otp/verify', { phone, otp });
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (payload) => api.post('/auth/register', payload);
export default api;
