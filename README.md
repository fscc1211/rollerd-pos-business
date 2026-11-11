# RollLerd POS & Business V2

Owner-only development package for the existing 14-page V2 interface.

- `index.html` — original V2 interface (currently retains its LocalStorage behavior).
- `supabase/schema.sql` — owner-only Supabase schema and RLS policies.
- `supabase/bridge.js` — Supabase sign-in and cloud state bridge.
- `supabase/client.example.js` — safe client configuration template (public anon key only).
- `SUPABASE_SETUP.md` — setup steps and remaining integration/testing work.

**Status:** connection foundation only; not yet a fully cloud-connected production app.


## ระบบแผนซื้อของและสต็อก (Owner Only)
- หน้าแผนซื้อของแสดงวัตถุดิบทุกชนิด พร้อมจำนวนที่ต้องซื้อ, checkbox ซื้อแล้ว, วันที่ซื้อ, ผู้ซื้อ และจำนวนรับเข้าจริง
- การบันทึกรับของจะเพิ่มสต็อกตามจำนวนรับจริง และรองรับการแก้จำนวนรับโดยปรับเฉพาะส่วนต่าง
- หน้าสต็อกแสดงวัตถุดิบทุกชนิดแม้ยอดเป็นศูนย์ พร้อมสถานะและข้อมูลซื้อเข้าล่าสุด
- ข้อมูลยังอยู่ใน LocalStorage ของเบราว์เซอร์ จนกว่าจะเชื่อม Supabase
