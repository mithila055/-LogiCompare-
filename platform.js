const platformToast = document.querySelector('#toast');
const bookingForm = document.querySelector('#booking-form');
const trackingForm = document.querySelector('#tracking-form');
const platformState = JSON.parse(localStorage.getItem('logicompare-platform') || '{}');
const shipmentKey = 'logicompare-shipments';
const defaultShipments = [{ trackingId: 'LC-BD-2408147', route: 'Dhaka → Chattogram', parcelType: 'Parcel', weight: 2, status: 'in_transit', payment: 'Paid' }, { trackingId: 'LC-BD-2408062', route: 'Dhaka → Sylhet', parcelType: 'Document', weight: 1, status: 'delivered', payment: 'Paid' }];
const shipments = JSON.parse(localStorage.getItem(shipmentKey) || JSON.stringify(defaultShipments));
let liveMap;
let parcelMarker;
let parcelPosition = 0;
const routePoints = [[23.8103, 90.4125], [23.5225, 90.5923], [23.2154, 90.7300], [22.9070, 90.8600], [22.3569, 91.7832]];
const platformCopy = {
  bn: { bookingEyebrow: 'চালান বুকিং', bookingTitle: 'পিকআপ বুক করুন', date: 'পিকআপের তারিখ', window: 'পিকআপ সময়', parcel: 'পার্সেলের ধরন', cod: 'ক্যাশ অন ডেলিভারি', generate: 'বুকিং তৈরি করুন', routeNote: 'আপনার quote-এর pickup ও delivery address', paymentEyebrow: 'পেমেন্ট', paymentTitle: 'কীভাবে পেমেন্ট করবেন', secure: 'নিরাপদ', mobile: 'মোবাইল ফাইন্যান্সিয়াল সার্ভিস', card: 'ভিসা, মাস্টারকার্ড', cash: 'ডেলিভারির সময় পেমেন্ট', paymentNote: 'Gateway confirmation-এর পর payment status আপডেট হবে।', trackingEyebrow: 'চালান ট্র্যাকিং', trackingTitle: 'প্রতিটি ধাপ দেখুন', track: 'ট্র্যাক', current: 'বর্তমান অবস্থা', inTransit: 'পথে আছে', route: 'ঢাকা হাব → চট্টগ্রাম হাব', eta: 'সম্ভাব্য সময়', historyEyebrow: 'চালানের ইতিহাস', historyTitle: 'আপনার সাম্প্রতিক চালান', export: 'CSV এক্সপোর্ট', notificationEyebrow: 'নোটিফিকেশন', notificationTitle: 'আপডেট থাকুন', operationsEyebrow: 'অপারেশনস ওয়ার্কস্পেস', operationsTitle: 'এক প্ল্যাটফর্ম, সব ভূমিকা', operationsDescription: 'অপারেশন workflow পরীক্ষা করতে role view বদলান।', customer: 'কাস্টমার', courier: 'কুরিয়ার পার্টনার', admin: 'অ্যাডমিন', activeBookings: 'চলমান বুকিং', wallet: 'ওয়ালেট ব্যালান্স', addresses: 'সংরক্ষিত ঠিকানা', profile: 'প্রোফাইল এডিট', newRequests: 'নতুন অনুরোধ', pickups: 'আজকের পিকআপ', onTime: 'সময়মতো ডেলিভারি', queue: 'পিকআপ queue দেখুন', total: 'মোট চালান', partners: 'সক্রিয় পার্টনার', disputes: 'অমীমাংসিত অভিযোগ', reports: 'অ্যাডমিন রিপোর্ট খুলুন' },
  en: { bookingEyebrow: 'Shipment booking', bookingTitle: 'Book a pickup', date: 'Pickup date', window: 'Pickup window', parcel: 'Parcel type', cod: 'COD amount', generate: 'Generate booking', routeNote: 'Pickup and delivery addresses from your quote', paymentEyebrow: 'Payment', paymentTitle: 'Choose how to pay', secure: 'Secure', mobile: 'Mobile financial service', card: 'Visa, Mastercard', cash: 'Pay when delivered', paymentNote: 'Payment status will update after gateway confirmation.', trackingEyebrow: 'Shipment tracking', trackingTitle: 'Follow every handoff', track: 'Track', current: 'Current status', inTransit: 'In transit', route: 'Dhaka hub → Chattogram hub', eta: 'ETA', historyEyebrow: 'Shipment history', historyTitle: 'Your recent shipments', export: 'Export CSV', notificationEyebrow: 'Notifications', notificationTitle: 'Stay up to date', operationsEyebrow: 'Operations workspace', operationsTitle: 'One platform, every role', operationsDescription: 'Switch between role views to test the operational workflows.', customer: 'Customer', courier: 'Courier partner', admin: 'Admin', activeBookings: 'Active bookings', wallet: 'Wallet balance', addresses: 'Saved addresses', profile: 'Edit profile', newRequests: 'New requests', pickups: "Today's pickups", onTime: 'On-time rate', queue: 'View pickup queue', total: 'Total shipments', partners: 'Active partners', disputes: 'Pending disputes', reports: 'Open admin reports' }
};

function platformMessage(message) {
  platformToast.textContent = message;
  platformToast.classList.add('is-visible');
  window.clearTimeout(platformMessage.timer);
  platformMessage.timer = window.setTimeout(() => platformToast.classList.remove('is-visible'), 2800);
}

function banglaDigits(value) {
  return String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);
}

function formatHistoryPrice(value) {
  const formattedValue = Number(value).toLocaleString('en-BD');
  return language === 'bn' ? `৳${banglaDigits(formattedValue)}` : `BDT ${formattedValue}`;
}

function markerIcon(className, content) {
  return L.divIcon({ className: '', html: `<span class="${className}">${content}</span>`, iconSize: className === 'parcel-marker' ? [30, 30] : [20, 20], iconAnchor: className === 'parcel-marker' ? [4, 27] : [10, 10] });
}

function initializeLeafletMap() {
  if (!window.L || !document.querySelector('#live-map')) return;
  liveMap = L.map('live-map', { zoomControl: false }).setView([23.15, 91.02], 8);
  L.control.zoom({ position: 'bottomright' }).addTo(liveMap);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(liveMap);
  const route = L.polyline(routePoints, { color: '#f06e55', weight: 4, opacity: .78, dashArray: '8 7' }).addTo(liveMap);
  L.marker(routePoints[0], { icon: markerIcon('hub-marker', '') }).addTo(liveMap).bindTooltip('Dhaka hub');
  L.marker(routePoints.at(-1), { icon: markerIcon('hub-marker', '') }).addTo(liveMap).bindTooltip('Chattogram hub');
  parcelMarker = L.marker(routePoints[1], { icon: markerIcon('parcel-marker', '<span>▰</span>') }).addTo(liveMap).bindPopup('LC-BD-2408147 · In transit');
  const fitLiveMap = () => { liveMap.invalidateSize(false); liveMap.fitBounds(route.getBounds(), { padding: [24, 24], maxZoom: 8 }); };
  fitLiveMap();
  window.setTimeout(fitLiveMap, 250);
  window.addEventListener('resize', fitLiveMap);
  document.querySelector('#map-center').addEventListener('click', () => liveMap.setView(parcelMarker.getLatLng(), 10, { animate: true }));
  window.setInterval(() => {
    parcelPosition = (parcelPosition + 1) % (routePoints.length - 1);
    const from = routePoints[parcelPosition];
    const to = routePoints[parcelPosition + 1];
    parcelMarker.setLatLng([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]);
    document.querySelector('#map-updated').textContent = language === 'bn' ? 'এইমাত্র আপডেট হয়েছে' : 'Updated just now';
  }, 8000);
}

function initializeGoogleMap() {
  if (!document.querySelector('#live-map')) return;
  const map = new google.maps.Map(document.querySelector('#live-map'), { center: { lat: 23.15, lng: 91.02 }, zoom: 8, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, gestureHandling: 'greedy' });
  const path = routePoints.map(([lat, lng]) => ({ lat, lng }));
  new google.maps.Polyline({ path, geodesic: true, strokeColor: '#f06e55', strokeOpacity: .85, strokeWeight: 4, map });
  new google.maps.Marker({ position: path[0], map, title: 'Dhaka hub' });
  new google.maps.Marker({ position: path.at(-1), map, title: 'Chattogram hub' });
  const googleMarker = new google.maps.Marker({ position: path[1], map, title: 'LC-BD-2408147 · In transit', animation: google.maps.Animation.DROP });
  const bounds = new google.maps.LatLngBounds();
  path.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, 24);
  document.querySelector('#map-center').addEventListener('click', () => { map.panTo(googleMarker.getPosition()); map.setZoom(10); });
  window.setInterval(() => {
    parcelPosition = (parcelPosition + 1) % (path.length - 1);
    const from = path[parcelPosition];
    const to = path[parcelPosition + 1];
    googleMarker.setPosition({ lat: (from.lat + to.lat) / 2, lng: (from.lng + to.lng) / 2 });
    document.querySelector('#map-updated').textContent = language === 'bn' ? 'এইমাত্র আপডেট হয়েছে' : 'Updated just now';
  }, 8000);
}

function initializeMaps() {
  const key = window.LOGICOMAP_GOOGLE_MAPS_API_KEY;
  if (!key) { initializeLeafletMap(); return; }
  window.__logicompareGoogleReady = initializeGoogleMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=__logicompareGoogleReady&v=weekly`;
  script.async = true;
  script.defer = true;
  script.onerror = () => initializeLeafletMap();
  document.head.appendChild(script);
}

function setPlatformLanguage(language) {
  const copy = platformCopy[language];
  const set = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
  const setMany = (selector, values) => document.querySelectorAll(selector).forEach((element, index) => { if (values[index] !== undefined) element.textContent = values[index]; });
  const setLabels = (selector, values) => document.querySelectorAll(selector).forEach((element, index) => { const textNode = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE); if (textNode && values[index] !== undefined) textNode.textContent = `${values[index]} `; });
  set('.booking-panel .eyebrow', copy.bookingEyebrow); set('.booking-panel h2', copy.bookingTitle); set('.booking-summary small', copy.routeNote); set('.booking-panel .primary-button span:first-child', copy.generate);
  setLabels('.booking-fields label', [copy.date, copy.window, copy.parcel, copy.cod]);
  set('.payment-panel .eyebrow', copy.paymentEyebrow); set('.payment-panel h2', copy.paymentTitle); set('.payment-badge', copy.secure); set('.secure-note', `▣ ${copy.paymentNote}`);
  setMany('.payment-option small', [copy.mobile, copy.mobile, copy.card, copy.cash]);
  set('.tracking-heading .eyebrow', copy.trackingEyebrow); set('.tracking-heading h2', copy.trackingTitle); set('.tracking-heading button', `${copy.track} →`); set('.tracking-current small', copy.current); set('#tracking-status', copy.inTransit); set('#tracking-route', copy.route); const etaLabel = document.querySelector('.tracking-eta'); const etaText = [...etaLabel.childNodes].find((child) => child.nodeType === Node.TEXT_NODE); if (etaText) etaText.textContent = `${copy.eta} `;
  set('.history-panel .eyebrow', copy.historyEyebrow); set('.history-panel h2', copy.historyTitle); set('#export-history', `${copy.export} ↓`); set('.notification-panel .eyebrow', copy.notificationEyebrow); set('.notification-panel h2', copy.notificationTitle);
  document.querySelectorAll('#history-list [data-price]').forEach((element) => { element.textContent = formatHistoryPrice(element.dataset.price); });
  set('#pay-button', language === 'bn' ? 'পেমেন্ট নিশ্চিত করুন →' : 'Confirm payment →'); set('.review-panel .eyebrow', language === 'bn' ? 'কুরিয়ার রিভিউ' : 'Courier review'); set('.review-panel h2', language === 'bn' ? 'ডেলিভারি রেট দিন' : 'Rate a delivered shipment'); setLabels('.review-form label', language === 'bn' ? ['চালান', 'আপনার মতামত'] : ['Shipment', 'Your feedback']); set('.review-form textarea', '');
  set('.role-heading .eyebrow', copy.operationsEyebrow); set('.role-heading h2', copy.operationsTitle); set('.role-heading > div:first-child p:last-child', copy.operationsDescription); setMany('.role-tab', [copy.customer, copy.courier, copy.admin]);
  setMany('[data-role-view="customer"] .role-stat span', [copy.activeBookings, copy.wallet, copy.addresses]); setMany('[data-role-view="customer"] .role-stat small', language === 'bn' ? ['পিকআপ নিশ্চিত', 'উপলব্ধ ক্রেডিট', 'বাড়ি, অফিস, গুদাম'] : ['Pickup confirmed', 'Available credit', 'Home, office, warehouse']); document.querySelectorAll('[data-role-view="customer"] .role-stat strong')[1].textContent = language === 'bn' ? '৳২,৮৪০' : 'BDT 2,840'; set('[data-action="profile"]', `${copy.profile} →`); setMany('[data-role-view="courier"] .role-stat span', [copy.newRequests, copy.pickups, copy.onTime]); setMany('[data-role-view="courier"] .role-stat small', language === 'bn' ? ['৪টি এলাকায়', '৭টি গ্রহণের অপেক্ষায়', 'শেষ ৩০ দিন'] : ['Across 4 service areas', '7 awaiting acceptance', 'Last 30 days']); set('[data-action="accept"]', `${copy.queue} →`); setMany('[data-role-view="admin"] .role-stat span', [copy.total, copy.partners, copy.disputes]); setMany('[data-role-view="admin"] .role-stat small', language === 'bn' ? ['এই মাসে +১৮.২%', '২টি যাচাইয়ের অপেক্ষায়', 'মনোযোগ প্রয়োজন'] : ['+18.2% this month', '2 pending review', 'Needs attention']); set('[data-action="reports"]', `${copy.reports} →`);
  set('#map-live-label', language === 'bn' ? 'সরাসরি লোকেশন' : 'Live location'); set('#map-updated', language === 'bn' ? 'এইমাত্র আপডেট হয়েছে' : 'Updated just now');
}

function setMinimumPickupDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  document.querySelector('#pickup-date').min = date.toISOString().slice(0, 10);
  document.querySelector('#pickup-date').value = date.toISOString().slice(0, 10);
}

document.querySelectorAll('.payment-option').forEach((option) => option.addEventListener('click', () => {
  document.querySelectorAll('.payment-option').forEach((item) => item.classList.remove('is-selected'));
  option.classList.add('is-selected');
  platformState.paymentMethod = option.dataset.payment;
  localStorage.setItem('logicompare-platform', JSON.stringify(platformState));
  platformMessage(`${option.dataset.payment} selected for your next booking`);
}));

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const trackingId = `LC-BD-${Date.now().toString().slice(-7)}`;
  const paymentMethod = platformState.paymentMethod || 'bKash';
  const shipment = { trackingId, route: document.querySelector('#booking-route').textContent, parcelType: document.querySelector('#parcel-type').value, paymentMethod, status: 'pickup_requested', payment: 'Pending', createdAt: new Date().toISOString() };
  shipments.unshift(shipment);
  localStorage.setItem(shipmentKey, JSON.stringify(shipments));
  platformState.lastShipment = shipment;
  localStorage.setItem('logicompare-platform', JSON.stringify(platformState));
  document.querySelector('#tracking-id').value = trackingId;
  document.querySelector('#history-list').insertAdjacentHTML('afterbegin', `<div class="history-item"><span class="history-code">LC</span><div><strong>${trackingId}</strong><small>Dhaka → Chattogram · ${shipment.parcelType}</small></div><span class="history-status status-transit">Pickup requested</span><b data-price="320">${formatHistoryPrice(320)}</b></div>`);
  platformMessage(`Booking created. ${trackingId} is ready for pickup.`);
  document.querySelector('#tracking').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

trackingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const trackingId = document.querySelector('#tracking-id').value.trim().toUpperCase();
  if (!/^LC-BD-\d{7}$/.test(trackingId)) {
    platformMessage('Enter a valid tracking ID, for example LC-BD-2408147');
    return;
  }
  const shipment = shipments.find((item) => item.trackingId === trackingId) || (trackingId === 'LC-BD-2408147' ? { status: 'in_transit', route: 'Dhaka hub → Chattogram hub' } : null);
  if (!shipment) {
    platformMessage(language === 'bn' ? 'এই tracking ID-তে কোনো চালান পাওয়া যায়নি' : 'No shipment found for this tracking ID');
    return;
  }
  document.querySelector('#tracking-status').textContent = shipment.status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  document.querySelector('#tracking-route').textContent = shipment.route || 'Awaiting courier pickup confirmation';
  document.querySelector('#tracking-eta').textContent = shipment.status === 'delivered' ? 'Delivered' : 'To be confirmed';
  platformMessage(`Tracking updated for ${trackingId}`);
});

document.querySelectorAll('.role-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.role-tab').forEach((item) => item.classList.remove('is-active'));
  document.querySelectorAll('.role-view').forEach((view) => view.classList.toggle('is-visible', view.dataset.roleView === tab.dataset.role));
  tab.classList.add('is-active');
}));

document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
  const actions = { profile: () => { window.location.href = 'auth.html#register'; }, accept: () => { document.querySelector('#booking').scrollIntoView({ behavior: 'smooth', block: 'center' }); platformMessage('Pickup queue is ready for the next booking.'); }, reports: () => { document.querySelector('#shipments').scrollIntoView({ behavior: 'smooth', block: 'center' }); platformMessage('Shipment reports opened.'); } };
  actions[button.dataset.action]?.();
}));

document.querySelector('#export-history').addEventListener('click', () => {
  const csv = 'Tracking ID,Route,Status\nLC-BD-2408147,Dhaka to Chattogram,In transit\nLC-BD-2408062,Dhaka to Sylhet,Delivered';
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'logicompare-shipment-history.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  platformMessage('Shipment history exported');
});

document.querySelectorAll('.notification-list button').forEach((button) => button.addEventListener('click', () => {
  button.classList.add('is-read');
  platformMessage('Notification marked as read');
}));

document.querySelector('#pay-button').addEventListener('click', () => {
  if (!platformState.lastShipment) {
    platformMessage(language === 'bn' ? 'পেমেন্টের আগে একটি booking তৈরি করুন' : 'Create a booking before confirming payment');
    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  platformState.paymentStatus = 'paid';
  const savedShipment = shipments.find((shipment) => shipment.trackingId === platformState.lastShipment.trackingId);
  if (savedShipment) savedShipment.payment = 'Paid';
  localStorage.setItem(shipmentKey, JSON.stringify(shipments));
  localStorage.setItem('logicompare-platform', JSON.stringify(platformState));
  platformMessage(language === 'bn' ? 'পেমেন্ট সফল হয়েছে' : 'Payment confirmed successfully');
});

let selectedRating = 0;
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => {
  selectedRating = Number(button.dataset.rating);
  document.querySelectorAll('[data-rating]').forEach((item) => item.classList.toggle('is-selected', Number(item.dataset.rating) <= selectedRating));
}));

document.querySelector('#review-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!selectedRating) {
    platformMessage(language === 'bn' ? 'রেটিং নির্বাচন করুন' : 'Select a rating first');
    return;
  }
  const review = { shipment: event.currentTarget.querySelector('select').value, rating: selectedRating, message: event.currentTarget.querySelector('textarea').value.trim(), createdAt: new Date().toISOString() };
  const reviews = JSON.parse(localStorage.getItem('logicompare-reviews') || '[]');
  localStorage.setItem('logicompare-reviews', JSON.stringify([review, ...reviews]));
  platformMessage(language === 'bn' ? 'আপনার রিভিউ জমা হয়েছে' : 'Your review has been submitted');
});

document.querySelector('.sidebar-footer .icon-button')?.addEventListener('click', () => {
  platformMessage(language === 'bn' ? 'প্রোফাইল সেটিংস খুলতে Account নির্বাচন করুন' : 'Choose Account to open profile settings');
});

setMinimumPickupDate();
setPlatformLanguage(localStorage.getItem('logicompare-language') || 'bn');
document.querySelectorAll('.language-button').forEach((button) => button.addEventListener('click', () => setPlatformLanguage(button.dataset.language)));
initializeMaps();
