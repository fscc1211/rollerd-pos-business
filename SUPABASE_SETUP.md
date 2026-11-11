# RollLerd POS & Business V2 — Owner-only Supabase setup

## Current phase
This version is for **one owner account only**. There are no staff accounts, staff roles, invitations, or staff permissions in this phase. Staff functionality can be added later without changing the shop's core data model.

## Included
- Original V2 interface (`index.html`) is preserved.
- `supabase/schema.sql` creates the shop, owner membership, operational state, owner-private finance, and audit logs.
- `supabase/bridge.js` provides owner sign-in, shop bootstrap, cloud load/save, and version-conflict protection.
- `supabase/client.example.js` shows where the Project URL and public anon key belong.

## Important status
This package is **not yet a live connected production app**. The original V2 page still uses LocalStorage until its load/save functions are explicitly wired to `RollLerdCloud`. The bridge and database schema are the owner-only connection foundation, not proof of a live cloud connection.

## Setup
1. Create a Supabase project.
2. In Supabase Authentication settings, create the owner's email/password account (disable public sign-ups if available).
3. Open SQL Editor and run `supabase/schema.sql`.
4. Copy `supabase/client.example.js` to `supabase/client.js` and fill in the Project URL and anon/public key from Project Settings → API.
5. Never put the `service_role` key in browser code or GitHub.
6. Sign in as the owner, then call `RollLerdCloud.createShop('โรลเลิศ โรลดี', initialState)` once to create the shop.
7. Wire V2's load/save flow to `RollLerdCloud.loadState()` and `RollLerdCloud.saveState()`.

## Data protection
- Only the authenticated owner account can access this shop. The database enforces this with Row Level Security (RLS).
- Owner-private finance is stored separately in `owner_private_finance`.
- Concurrent saves use a version check and raise `VERSION_CONFLICT` rather than silently overwriting newer data.
- `audit_logs` records cloud state writes. More detailed per-transaction audit events should be added as individual workflows are migrated.

## Before real business use
- Complete UI integration for all 14 sections.
- Migrate existing LocalStorage data through a reviewed import; do not overwrite existing data blindly.
- Implement and test normalized transaction workflows for purchases, partial receiving, payments, sales, stock movements, recipe consumption, expenses, payroll, and reconciliation.
- Test sign-in, cross-device sync, offline/retry behavior, duplicate submissions, cash reconciliation, and backup/restore.
