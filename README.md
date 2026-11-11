# RollLerd POS — GitHub Pages build

Upload these files directly to the GitHub repository root (same level): `index.html`, `config.js`, `cloud.js`. Keep the filenames exactly as written.

The page loads `./config.js` and `./cloud.js` relative to `index.html`, suitable for a GitHub Pages project site. Supabase SDK is loaded from jsDelivr.

Never put a Supabase `service_role` key or database password in frontend code. The publishable key in config.js is intended for browser use.
