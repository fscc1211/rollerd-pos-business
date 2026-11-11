# RollLerd POS & Business V2 — Supabase Owner Integration

Owner-only package based on the existing 14-page V2 interface.

- `index.html` — V2 owner interface.
- `supabase/config.js` — Supabase Project URL and browser-safe Publishable key.
- `supabase/cloud.js` — Supabase Auth, load state, and version-checked save RPC bridge.
- `supabase/schema_owner_only.sql` — owner-only table, RLS policy, and secure write function.
- `SUPABASE_SETUP.md` — setup and test instructions.

**Important:** This is an integration package, not a claim that a live database connection has already been tested. Follow `SUPABASE_SETUP.md`, then test login, load, save, refresh, and cross-device behavior.

## Existing V2 features
The 14 existing pages are retained. Purchase-plan checkboxes, purchase date/buyer, received quantity, and ingredient stock display remain in the V2 interface. Stock increases by actual received quantity; recipe-based stock deduction is not yet implemented.

## Data model
The current integration stores the complete V2 application state as one JSONB document per owner in `public.owner_state`. It is suitable for an initial owner-only integration but does not yet provide normalized transaction tables or a detailed audit trail.
