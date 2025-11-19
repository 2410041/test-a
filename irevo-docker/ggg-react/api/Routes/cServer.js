const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// 企業ログイン: POST /company/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    // デバッグ: 受信ペイロードのキー一覧とサンプルをログ出力
    try {
        console.log('cServer /login received payload keys:', Object.keys(req.body || {}));
        console.log('cServer /login sample:', { email: req.body?.email, password: req.body?.password ? '[REDACTED]' : undefined });
    } catch (e) {
        console.warn('cServer /login logging failed', e);
    }
    if (!email || !password) {
        return res.status(400).json({ success: false, message: '必須項目が未入力です' });
    }

    try {
        const [rows] = await global.db.query('SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)', [email]);
        if (!rows || rows.length === 0) {
            return res.json({ success: false, message: 'メールアドレスまたはパスワードが間違っています' });
        }

        const company = rows[0];
        let isValid = false;
        if (company.password && typeof company.password === 'string' && company.password.startsWith && company.password.startsWith('$2b$')) {
            isValid = await bcrypt.compare(password, company.password);
        } else {
            isValid = password === company.password;
        }

        if (!isValid) {
            return res.json({ success: false, message: 'メールアドレスまたはパスワードが間違っています' });
        }

        // セッションに企業情報を保存（パスワードは除外）
        req.session.company = {
            id: company.id || company.company_id || null,
            company_name: company.company_name,
            email: company.email
        };

        // レスポンスからパスワードを除去して返す
        const safeCompany = { ...company };
        delete safeCompany.password;

        return res.json({ success: true, company: safeCompany });
    } catch (err) {
        console.error('Company login error:', err);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 企業のログイン状態確認: GET /company/whoami
router.get('/whoami', async (req, res) => {
    try {
        if (req.session && req.session.company) {
            // 可能であれば最新の会社情報をDBから取得して返す（パスワードは除外）
            const sess = req.session.company;
            let companyRow = null;
            try {
                if (sess.id) {
                    const [rows] = await global.db.query('SELECT * FROM corporations WHERE id = ?', [sess.id]);
                    if (rows && rows.length) companyRow = rows[0];
                }
                if (!companyRow && sess.email) {
                    const [rows2] = await global.db.query('SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)', [sess.email]);
                    if (rows2 && rows2.length) companyRow = rows2[0];
                }
            } catch (e) {
                console.warn('company whoami DB lookup failed:', e);
            }

            if (companyRow) delete companyRow.password;

            return res.json({ loggedIn: true, company: companyRow || sess });
        }
        return res.json({ loggedIn: false });
    } catch (err) {
        console.error('company whoami error:', err);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 企業一覧取得API
router.get('/company', async (req, res) => {
    try {
        const [results] = await global.db.query(`SELECT * FROM ViewCompanyTable`);
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 企業検索（都道府県・職種フィルタ）API
router.get('/company_filter', async (req, res) => {
    // クエリパラメータ取得
    const { prefecture, job, employee_size, salary } = req.query;

    // employee_size を分割して整数化（既存の処理）
    let empMin = null;
    let empMax = null;
    if (employee_size && typeof employee_size === 'string') {
        const parts = employee_size.trim().split('-');
        if (parts.length === 2) {
            const a = parseInt(parts[0], 10);
            const b = parseInt(parts[1], 10);
            empMin = Number.isInteger(a) ? a : null;
            empMax = Number.isInteger(b) ? b : null;
        }
    }

    // salary（フロントからの最小希望給与）を整数化
    let salaryInt = null;
    if (salary !== undefined && salary !== null && String(salary).trim() !== '') {
        const s = parseInt(String(salary).replace(/[^\d-]/g, ''), 10);
        salaryInt = Number.isInteger(s) ? s : null;
    }

    try {
        const values = [];
        let sql = `SELECT * FROM ViewCompanyTable WHERE 1=1`;

        if (prefecture && String(prefecture).trim() !== '') {
            sql += ` AND location LIKE ?`;
            values.push(`%${prefecture}%`);
        }

        if (job && String(job).trim() !== '') {
            sql += ` AND title LIKE ?`;
            values.push(`%${job}%`);
        }

        // 従業員規模フィルタ
        if (empMin !== null && empMax !== null) {
            sql += ` AND employee_count >= ? AND employee_count <= ?`;
            values.push(empMin, empMax);
        }

        // 追加: salary を受け取り、"salary <= salary_max" 条件を適用
        // フロント側 salary は「希望最低額（例: 350000）」で来る想定 -> 表の salary_max 以上の求人を返す
        if (salaryInt !== null) {
            // salary_max が NULL の場合は salary カラムを代替で使う
            sql += ` AND IFNULL(salary_max, salary) >= ?`;
            values.push(salaryInt);
        }

        console.log('実行SQL:', sql, 'params:', values);
        const [results] = await global.db.query(sql, values);
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 地図用：勤務地一覧を返す API
// フロント（画面）から「県名などのキーワード（work_location）」が送られてきたら、
// その文字をふくむ住所だけをしぼって返します。
// キーワードが空なら、全部の勤務地リストを返します。
router.get('/Jobmap', async (req, res) => {
    // 例: /Jobmap?work_location=大阪 → "大阪" を取得
    const { work_location } = req.query;

    // 送られてきたキーワードを確認（空文字なら全件取得）
    console.log("work_location:", work_location === '' ? '(空文字 - 全件取得)' : work_location);

    try {
        // SQLの初期文：勤務地（location）が空でないレコードをすべて取得
        let sql = `SELECT DISTINCT location AS work_location FROM Companies WHERE location IS NOT NULL AND location <> ''`;
        // プレースホルダ用配列（SQLインジェクション対策）
        const values = [];

        // work_location が空でなければ、部分一致検索を追加
        if (work_location && work_location.trim() !== '') {
            // ? はプレースホルダ（後で values に代入）
            sql += ` AND location LIKE ?`;
            // 例: "%大阪%"
            values.push(`%${work_location}%`);
            console.log("フィルタリング実行:", work_location);
        } else {
            console.log("全件取得モード");
        }

        console.log("実行するSQL:", sql);

        // 実際にクエリを実行（awaitで非同期処理完了を待つ）
        const [results] = await global.db.query(sql, values);

        // 結果の件数と一部データをログ出力
        console.log(`取得件数: ${results.length}件`);
        // ←ここ追加：3件だけ中身を見る
        console.log("サンプル結果:", results.slice(0, 3));

        // 結果をフロント（ブラウザ）へ返す
        res.json(results);

    } catch (err) {
        // SQL実行や接続でエラーが発生した場合
        console.error('Database query error:', err);
        return res.status(500).json({ error: err.message });
    }
});

// 会社詳細取得（company_id をクエリで受け取る）
router.get('/company_detail', async (req, res) => {
    try {
        const { company_id } = req.query;
        if (!company_id) 
            return res.status(400).json({
            error: 'company_id is required'
        });
        const [rows] = await global.db.query(
            'SELECT * FROM CompanyDetails WHERE company_id = ?',
            [company_id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('Database query error (company_detail):', err);
        res.status(500).json({
            error: err.message
        });
    }
});

// 会社詳細取得（REST風）： /company/:id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // ViewCompanyTable から基本情報を取得
        const [companies] = await global.db.query('SELECT * FROM ViewCompanyTable WHERE id = ?', [id]);
        if (companies.length === 0) return res.status(404).json({ error: 'company not found' });
        const company = companies[0];
        // CompanyDetails から追加情報を取得（存在すればマージ）
        const [details] = await global.db.query('SELECT * FROM CompanyDetails WHERE company_id = ?', [id]);
        const merged = { ...company, ...(details[0] || {}) };
        res.json(merged);
    } catch (err) {
        console.error('Database query error (company/:id):', err);
        res.status(500).json({ error: err.message });
    }
});

// 共通: 動的UPDATE用のユーティリティ
function buildUpdateSet(body, allow) {
  const fields = [];
  const values = [];
  for (const k of allow) {
    if (body[k] !== undefined) {
      fields.push(`${k} = ?`);
      values.push(body[k]);
    }
  }
  return { setSql: fields.join(', '), values };
}

// 作成: POST /company/company (dataProviderのパスに合わせて用意)
router.post('/company', async (req, res) => {
  try {
    const allow = ['c_name','location','founded_year','capital','employee_count','description','homepage_url','logo','photo'];
    const cols = [];
    const vals = [];
    const q = [];
    for (const k of allow) {
      if (req.body[k] !== undefined) {
        cols.push(k);
        vals.push(req.body[k]);
        q.push('?');
      }
    }
    if (!cols.length) return res.status(400).json({ success:false, message:'no fields' });
    const [r] = await global.db.query(`INSERT INTO Companies (${cols.join(',')}) VALUES (${q.join(',')})`, vals);
    const [rows] = await global.db.query('SELECT * FROM Companies WHERE id = ?', [r.insertId]);
    res.json(rows[0]);
  } catch (e) {
    console.error('Companies create error:', e);
    res.status(500).json({ success:false, message:'サーバーエラー' });
  }
});

router.post('/company/company', async (req, res) => { // dataProvider互換
  try {
    const allow = ['c_name','location','founded_year','capital','employee_count','description','homepage_url','logo','photo'];
    const cols = [];
    const vals = [];
    const q = [];
    for (const k of allow) {
      if (req.body[k] !== undefined) { cols.push(k); vals.push(req.body[k]); q.push('?'); }
    }
    if (!cols.length) return res.status(400).json({ success:false, message:'no fields' });
    const [r] = await global.db.query(`INSERT INTO Companies (${cols.join(',')}) VALUES (${q.join(',')})`, vals);
    const [rows] = await global.db.query('SELECT * FROM Companies WHERE id = ?', [r.insertId]);
    res.json(rows[0]);
  } catch (e) { console.error('Companies create error:', e); res.status(500).json({ success:false, message:'サーバーエラー' }); }
});

// 更新: PUT /company/company/:id と /company/:id
router.put('/company/:id', async (req, res) => {
  try {
    const allow = ['c_name','location','founded_year','capital','employee_count','description','homepage_url','logo','photo'];
    const { setSql, values } = buildUpdateSet(req.body, allow);
    if (!setSql) return res.status(400).json({ success:false, message:'no fields' });
    values.push(req.params.id);
    await global.db.query(`UPDATE Companies SET ${setSql} WHERE id = ?`, values);
    const [rows] = await global.db.query('SELECT * FROM Companies WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, message:'not found' });
    res.json(rows[0]);
  } catch (e) { console.error('Companies update error:', e); res.status(500).json({ success:false, message:'サーバーエラー' }); }
});
router.put('/company/company/:id', async (req, res) => { // dataProvider互換
  req.url = `/company/${req.params.id}`;
  return router.handle(req, res);
});

// 削除: DELETE /company/company/:id と /company/:id
router.delete('/company/:id', async (req, res) => {
  try {
    await global.db.query('DELETE FROM Companies WHERE id = ?', [req.params.id]);
    res.json({ success:true, id: Number(req.params.id) });
  } catch (e) { console.error('Companies delete error:', e); res.status(500).json({ success:false, message:'サーバーエラー' }); }
});
router.delete('/company/company/:id', async (req, res) => { // dataProvider互換
  req.url = `/company/${req.params.id}`;
  return router.handle(req, res);
});

module.exports = router;