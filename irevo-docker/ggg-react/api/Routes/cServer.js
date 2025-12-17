const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/*
    共通：企業ログイン必須チェック
*/
function requireCompanyLogin(req, res, next) {
    if (!req.session || !req.session.company || !req.session.company.id) {
        return res.status(401).json({
            success: false,
            message: 'ログインが必要です'
        });
    }
    next();
}

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
        const [rows] = await global.db.query(
            'SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)',
            [email]
        );
        if (!rows || rows.length === 0) {
            return res.json({ success: false, message: 'メールアドレスまたはパスワードが間違っています' });
        }

        const company = rows[0];
        let isValid = false;
        if (
            company.password &&
            typeof company.password === 'string' &&
            company.password.startsWith &&
            company.password.startsWith('$2b$')
        ) {
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
        console.error('Company login error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'サーバーエラー', error: String(err) });
    }
});

// 企業のログイン状態確認: GET /company/whoami
router.get('/whoami', async (req, res) => {
    try {
        if (req.session && req.session.company) {
            const sess = req.session.company;
            let companyRow = null;
            try {
                if (sess.id) {
                    const [rows] = await global.db.query(
                        'SELECT * FROM corporations WHERE id = ?',
                        [sess.id]
                    );
                    if (rows && rows.length) companyRow = rows[0];
                }
                if (!companyRow && sess.email) {
                    const [rows2] = await global.db.query(
                        'SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)',
                        [sess.email]
                    );
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

// 企業情報更新: POST /company/update
router.post('/update', requireCompanyLogin, async (req, res) => {
    try {
        const allowed = [
            'company_name',
            'representative_name',
            'phone_number',
            'email',
            'location',
            'business',
            'website',
            'address'
        ];
        const payload = req.body || {};

        const sess = req.session.company;
        let companyId = sess.id || null;

        const sets = [];
        const vals = [];
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                sets.push(`${key} = ?`);
                vals.push(payload[key]);
            }
        }

        if (sets.length === 0)
            return res.status(400).json({ success: false, message: '更新するフィールドが指定されていません' });

        if (!companyId && sess.email) {
            const [rows] = await global.db.query(
                'SELECT id FROM corporations WHERE LOWER(email) = LOWER(?)',
                [sess.email]
            );
            if (rows && rows.length) companyId = rows[0].id;
        }

        if (!companyId)
            return res.status(400).json({ success: false, message: '会社IDが不明のため更新できません' });

        await global.db.query(
            `UPDATE corporations SET ${sets.join(', ')} WHERE id = ?`,
            [...vals, companyId]
        );

        const [rows2] = await global.db.query(
            'SELECT * FROM corporations WHERE id = ?',
            [companyId]
        );

        if (!rows2.length)
            return res.status(404).json({ success: false, message: '更新後の会社情報が見つかりません' });

        const updated = rows2[0];
        delete updated.password;
        req.session.company = {
            id: updated.id,
            company_name: updated.company_name,
            email: updated.email
        };

        return res.json({ success: true, company: updated });
    } catch (err) {
        console.error('company update handler error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'サーバーエラー', error: String(err) });
    }
});

module.exports = router;
