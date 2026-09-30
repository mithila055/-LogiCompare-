import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const routePoints = [[23.8103, 90.4125], [23.5225, 90.5923], [23.2154, 90.7300], [22.9070, 90.8600], [22.3569, 91.7832]];

export default function LiveMap({ trackingId = 'LC-BD-2408147' }) {
  const mapRef = useRef(null);
  const parcelRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return undefined;
    const map = L.map(mapRef.current).setView([23.15, 91.02], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    const route = L.polyline(routePoints, { color: '#f06e55', weight: 4, dashArray: '8 7' }).addTo(map);
    L.marker(routePoints[0]).addTo(map).bindTooltip('Dhaka hub');
    L.marker(routePoints.at(-1)).addTo(map).bindTooltip('Chattogram hub');
    parcelRef.current = L.marker(routePoints[1]).addTo(map).bindPopup(`${trackingId} · In transit`);
    map.fitBounds(route.getBounds(), { padding: [20, 20] });
    let position = 1;
    const timer = window.setInterval(() => { position = (position + 1) % (routePoints.length - 1); const from = routePoints[position]; const to = routePoints[position + 1]; parcelRef.current.setLatLng([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]); }, 8000);
    return () => { window.clearInterval(timer); map.remove(); };
  }, [trackingId]);
  return <div className="live-map-panel react-live-map"><div ref={mapRef} id="react-live-map" /><div className="map-overlay"><span className="live-dot" /><strong>Live location</strong><small>Updated just now</small></div></div>;
}
