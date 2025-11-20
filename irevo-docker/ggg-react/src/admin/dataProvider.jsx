// このファイルは「APIサーバー」とやりとりするための共通関数セットです。
// 例えば「ユーザー一覧を取得」「企業情報を取得」「新しいデータを作る」などを簡単に呼び出せます。

// APIサーバーのURL（自分のパソコンで動かす場合は15.152.5.110）
const apiUrl = 'http://15.152.5.110:3030';
const mockData = {};

const resourceMap = {
  // ↓ 修正 (/user/user → /user)
  users: '/user/userGet',               
  companies: '/company/company',
  locations: '/location/location',
};

function ensureSlash(p) { return p.startsWith('/') ? p : '/' + p; }

async function doFetch(method, url, body) {
  const opt = { method, credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  if (body) opt.body = JSON.stringify(body);
  const res = await fetch(url, opt);
  if (!res.ok) throw new Error(`${method} ${url} ${res.status}`);
  try { return await res.json(); } catch { return {}; }
}

export const dataProvider = {
  // getList: 一覧データを取得する関数
  // 例：ユーザー一覧や企業一覧など
  getList: async (resource, params) => {
    const rawPath = resourceMap[resource] || `/${resource}`;
    const path = ensureSlash(rawPath);
    try {
      // APIサーバーにリクエストを送る
      const res = await fetch(`${apiUrl}${path}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`fetch ${path} failed: ${res.status}`);
      // 結果をJSON形式で受け取る
      const data = await res.json();
      // 返ってきたデータが配列ならそのまま、そうでなければ rows や data から探す
      const rows = Array.isArray(data) ? data : (data.rows || data.data || []);
      // { data: 実データ, total: 件数 } の形で返す
      return { data: rows, total: rows.length };
    } catch (err) {
      // APIが失敗した場合は「モックデータ」にフォールバック
      console.warn('[getList] fallback mock:', err);
      const resourceData = (mockData && mockData[resource]) || [];
      return { data: resourceData, total: resourceData.length };
    }
  },

  // getOne: 1件だけデータを取得する関数
  // 例：ユーザー詳細や企業詳細など
  getOne: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    try {
      // /resource/:id 形式でAPIにリクエスト
      const res = await fetch(`${apiUrl}${ensureSlash(path)}/${params.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('getOne failed');
      const data = await res.json();
      return { data };
    } catch {
      // もしAPIが未対応なら一覧取得してidで探す
      const list = await dataProvider.getList(resource, {});
      const item = list.data.find(r => String(r.id) === String(params.id));
      return { data: item || { id: params.id } };
    }
  },

  // create: 新しいデータを作る関数
  // 例：新規ユーザー登録や企業追加など
  create: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    try {
      const data = await doFetch('POST', `${apiUrl}${ensureSlash(path)}`, params.data);
      return { data };
    } catch (err) {
      console.warn('[dataProvider.create] API failed, returning mock created', err);
      return { data: { id: Date.now(), ...params.data } };
    }
  },
  update: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    try {
      const data = await doFetch('PUT', `${apiUrl}${ensureSlash(path)}/${params.id}`, params.data);
      return { data };
    } catch (err) {
      console.warn('[dataProvider.update] API failed, returning mock updated', err);
      return { data: { id: params.id, ...params.data } };
    }
  },
  delete: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    try {
      await doFetch('DELETE', `${apiUrl}${ensureSlash(path)}/${params.id}`);
      return { data: { id: params.id } };
    } catch (err) {
      console.warn('[dataProvider.delete] API failed, fallback', err);
      return { data: { id: params.id } };
    }
  },

  // 追加: 複数更新
  updateMany: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    const succeeded = [];
    for (const id of params.ids) {
      try {
        await doFetch('PUT', `${apiUrl}${ensureSlash(path)}/${id}`, params.data);
        succeeded.push(id);
      } catch { /* 個別失敗は無視 */ }
    }
    return { data: succeeded };
  },

  // 追加: 複数削除
  deleteMany: async (resource, params) => {
    const path = resourceMap[resource] || `/${resource}`;
    const succeeded = [];
    for (const id of params.ids) {
      try {
        await doFetch('DELETE', `${apiUrl}${ensureSlash(path)}/${id}`);
        succeeded.push(id);
      } catch { /* 個別失敗は無視 */ }
    }
    return { data: succeeded };
  },
};