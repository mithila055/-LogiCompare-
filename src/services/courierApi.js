import api from './authApi';
export const getCourierQuotes = (payload) => api.post('/couriers/quotes', payload);
export const getCourierPartners = () => api.get('/couriers');
export const getCourierTasks = () => api.get('/courier/tasks');
export const acceptPickup = (shipmentId) => api.post(`/courier/tasks/${shipmentId}/accept`);
