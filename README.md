# Arum Tenda — frontend prototype

Static company-profile prototype made with HTML, CSS, and vanilla JavaScript. It has no backend or database. Run it with Vite:

1. Install Node.js (npm is included).
2. From this folder, run `npm.cmd install` once in PowerShell. (Use `npm` in Command Prompt.)
3. Run `npm.cmd run dev` and open the local URL printed by Vite (normally <http://localhost:5173>).

On Windows, you can also double-click `start-local.cmd`; it installs dependencies if needed and starts Vite.

Use `npm run build` to create the production files in `dist/`, or `npm run preview` to preview that build. `node serve-local.js` remains available as a simple static-server fallback on port 8000.

## Prototype features

- Landing page and company introduction.
- Rental catalog with sample tents, tableware, glassware, event equipment, indicative prices, categories, and photo URLs.
- WhatsApp order links with prefilled messages.
- Example event gallery with Instagram profile links.
- Clickable catalog item details, with tent-canopy color and scene preview inside tent product details.
- Mobile quick navigation that highlights the current section and scrolls directly to About, Catalog, Gallery, or Color Preview.
- Catalog editor for adding, changing, or removing products. Data is saved to this browser's `localStorage` only.

## Before using for a real business

Update `WA_NUMBER` and `INSTAGRAM_URL` near the top of `app.js`. Replace the sample catalog prices and image URLs in `defaultProducts`, and replace the sample gallery and story images in `index.html`. Prices and all photos are illustrative; photos, fonts, and Bootstrap Icons load from external services and need an internet connection.

Instagram does not sync automatically in this static prototype. Automatic feed sync requires an Instagram professional account, API access/token handling, and a backend. The tent preview changes the color of an illustrative canopy overlay against sample event photos; it is not a precise material/color proof. Catalog edits are local to one browser and are not shared between devices.

The older exported scripts remain in `files/` for reference and are not used by this prototype.
