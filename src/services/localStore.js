const SHIPMENTS_KEY = 'logicompare-shipments';

const seedShipments = [
  { trackingId: 'LC-BD-2408147', route: 'Dhaka -> Chattogram', parcelType: 'Parcel', weight: 2, window: '09:00 - 12:00', status: 'in_transit', payment: 'Paid', price: 320, createdAt: '2024-08-14T08:40:00.000Z' },
  { trackingId: 'LC-BD-2408062', route: 'Dhaka -> Sylhet', parcelType: 'Document', weight: 1, window: '12:00 - 15:00', status: 'delivered', payment: 'Paid', price: 180, createdAt: '2024-08-06T08:40:00.000Z' }
];

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
};

export const getShipments = () => read(SHIPMENTS_KEY, seedShipments);

export const saveShipments = (shipments) => {
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments));
  window.dispatchEvent(new CustomEvent('logicompare:shipments-changed'));
  return shipments;
};

export const getShipment = (trackingId) => getShipments().find((shipment) => shipment.trackingId === trackingId);

export const createShipment = (payload) => {
  const shipment = {
    trackingId: `LC-BD-${Date.now().toString().slice(-7)}`,
    ...payload,
    status: 'pickup_requested',
    payment: 'Pending',
    createdAt: new Date().toISOString()
  };
  saveShipments([shipment, ...getShipments()]);
  return shipment;
};

const statusOrder = ['pickup_requested', 'pickup_confirmed', 'picked_up', 'in_transit', 'sorting_hub', 'out_for_delivery', 'delivered'];

export const updateShipmentStatus = (trackingId, status) => {
  const shipments = getShipments();
  const current = shipments.find((shipment) => shipment.trackingId === trackingId);
  if (!current) throw new Error('Shipment not found');
  if (statusOrder.indexOf(status) < statusOrder.indexOf(current.status)) throw new Error('Shipment status cannot move backward');
  const updated = shipments.map((shipment) => shipment.trackingId === trackingId ? { ...shipment, status } : shipment);
  saveShipments(updated);
  return updated.find((shipment) => shipment.trackingId === trackingId);
};

export const formatStatus = (status) => status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());