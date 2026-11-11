/* RollLerd POS — Supabase browser client. Keep this file beside index.html. */
(function (g) {
  'use strict';

  let client = null;
  let ownerId = null;

  function init() {
    const cfg = g.ROLLLERD_SUPABASE_CONFIG;
    if (!cfg || !cfg.url || !cfg.anonKey) {
      throw new Error('ไม่พบการตั้งค่า Supabase ใน config.js');
    }
    if (!g.supabase || typeof g.supabase.createClient !== 'function') {
      throw new Error('โหลด Supabase SDK ไม่สำเร็จ กรุณาตรวจอินเทอร์เน็ตหรือ CDN');
    }
    if (!client) {
      client = g.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return client;
  }

  async function getSession() {
    const { data, error } = await init().auth.getSession();
    if (error) throw error;
    ownerId = data.session && data.session.user ? data.session.user.id : null;
    return data.session || null;
  }

  async function signIn(email, password) {
    const { data, error } = await init().auth.signInWithPassword({ email, password });
    if (error) throw error;
    ownerId = data.user ? data.user.id : null;
    return data;
  }

  async function signOut() {
    const { error } = await init().auth.signOut();
    if (error) throw error;
    ownerId = null;
  }

  async function loadState() {
    const c = init();
    const session = await getSession();
    if (!session) throw new Error('กรุณาเข้าสู่ระบบก่อนโหลดข้อมูล');
    const { data, error } = await c
      .from('owner_state')
      .select('data, version')
      .eq('owner_id', session.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { data: data.data, version: Number(data.version) };
  }

  async function saveState(state, expectedVersion) {
    const c = init();
    const session = await getSession();
    if (!session) throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
    const { data, error } = await c.rpc('save_my_rolllerd_state', {
      p_data: state,
      p_expected_version: Number(expectedVersion || 0)
    });
    if (error) throw error;
    return { version: Number(data) };
  }

  g.RollLerdCloud = Object.freeze({ init, getSession, signIn, signOut, loadState, saveState });
})(window);
