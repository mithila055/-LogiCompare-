# LogiCompare

A Bangladesh delivery rate comparison frontend with both the current dependency-free preview and a modular React/Vite source tree. Open `index.html` directly in a browser to use the preview, or run the React app with `npm install` and `npm run dev`.

## Included

- Responsive operations dashboard layout
- Bangladesh routes, courier examples, BDT pricing, and Bangla labels
- Route, destination, and weight inputs
- Filterable rate comparison table
- Price sorting and saved-rate interactions
- Shipment insights and operational status
- Login and registration page at `auth.html`

The page uses Google Fonts when online and falls back gracefully when offline. No build step is required.

## React frontend

The planned application entry is `react.html`, with the requested structure under `src/`:

- Customer, admin, and courier layouts and pages
- Shared buttons, inputs, modal, loader, cards, and data grid
- Auth context, private routes, hooks, API service boundaries, and formatting utilities
- `VITE_API_BASE_URL` in `.env` for the backend API
- `VITE_GOOGLE_MAPS_API_KEY` in `.env` for the React map; the static preview reads a browser-restricted key from `google-maps-config.js`

The current environment does not have Node.js installed, so dependency installation and Vite build verification must be run on a Node-enabled machine.

## Google Maps setup

Enable **Maps JavaScript API** in Google Cloud, restrict the key to your app domains, then add it to `.env` as `VITE_GOOGLE_MAPS_API_KEY`. For the direct static preview, set the same browser-restricted key in `google-maps-config.js`. Without a key, the map safely falls back to OpenStreetMap/Leaflet.
