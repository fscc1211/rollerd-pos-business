# RollLerd POS & Business V2

Owner-only development package for the existing 14-page V2 interface.

- `index.html` — original V2 interface (currently retains its LocalStorage behavior).
- `supabase/schema.sql` — owner-only Supabase schema and RLS policies.
- `supabase/bridge.js` — Supabase sign-in and cloud state bridge.
- `supabase/client.example.js` — safe client configuration template (public anon key only).
- `SUPABASE_SETUP.md` — setup steps and remaining integration/testing work.

**Status:** connection foundation only; not yet a fully cloud-connected production app.
