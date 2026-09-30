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

The current environment does not have Node.js installed, so dependency installation and Vite build verification must be run on a Node-enabled machine.
