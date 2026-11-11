/* RollLerd Supabase bridge (integration module; V2 UI remains unchanged in this package).
 * Load @supabase/supabase-js v2 before this file, then supabase/client.js.
 * This bridge deliberately keeps owner-private finance in a separate table.
 */
(function (global) {
  'use strict';
  let client = null;
  let shopId = null;
  let version = null;
  function connect() {
    const cfg = global.ROLLLERD_SUPABASE_CONFIG;
    if (!cfg || !cfg.url || !cfg.anonKey || !global.supabase?.createClient) {
      throw new Error('Supabase ยังไม่ได้ตั้งค่า: ตรวจ supabase/client.js และไลบรารี Supabase');
    }
    if (!client) client = global.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
  }
  async function signIn(email, password) {
    const { data, error } = await connect().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  async function signOut() {
    const { error } = await connect().auth.signOut();
    if (error) throw error;
    shopId = null; version = null;
  }
  async function createShop(name, initialData) {
    const { data, error } = await connect().rpc('create_rolllerd_shop', {
      p_shop_name: name || 'โรลเลิศ โรลดี', p_initial_data: initialData || {}
    });
    if (error) throw error;
    shopId = data; version = 1;
    return data;
  }
  async function findMyShop() {
    const c = connect();
    const { data: userData, error: userError } = await c.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) return null;
    const { data, error } = await c.from('shop_members')
      .select('shop_id, role, active, shops(name,currency)')
      .eq('user_id', userData.user.id).eq('active', true).limit(1).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    shopId = data.shop_id;
    return { shopId, role: data.role, shop: data.shops };
  }
  async function loadState(id) {
    const target = id || shopId;
    if (!target) throw new Error('ยังไม่ได้เลือก/สร้างร้าน');
    const { data, error } = await connect().from('shop_state')
      .select('data,version,updated_at,updated_by').eq('shop_id', target).single();
    if (error) throw error;
    shopId = target; version = Number(data.version);
    return { state: data.data, version, updatedAt: data.updated_at, updatedBy: data.updated_by };
  }
  async function saveState(state) {
    if (!shopId || version == null) throw new Error('ต้องโหลดข้อมูลร้านก่อนบันทึก');
    const { data, error } = await connect().rpc('save_rolllerd_state', {
      p_shop_id: shopId, p_data: state, p_expected_version: version
    });
    if (error) throw error;
    version = Number(data);
    return { version };
  }
  async function getRole() {
    const membership = await findMyShop();
    return membership ? 'owner' : null;
  }
  global.RollLerdCloud = { connect, signIn, signOut, createShop, findMyShop, loadState, saveState, getRole };
})(window);
