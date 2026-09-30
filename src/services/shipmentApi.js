import api from './authApi';
export const createShipment = (payload) => api.post('/shipments', payload);
export const getShipment = (trackingId) => api.get(`/shipments/${trackingId}`);
export const updateShipmentStatus = (trackingId, status) => api.patch(`/shipments/${trackingId}/status`, { status });
export const getShipmentHistory = () => api.get('/shipments/history');
export const cancelShipment = (trackingId) => api.post(`/shipments/${trackingId}/cancel`);
