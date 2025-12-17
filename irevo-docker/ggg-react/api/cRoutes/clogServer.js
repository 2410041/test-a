const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/* 
    共通：パラメータ取得用のヘルパー関数（追加）
    フロントは axios.post({ params: { ... } }) を送っているため、
    バックエンドは req.body.params を最優先で読み込む必要がある。
*/
function getParams(req) {
    return {
        ...req.body?.params,
        ...req.body,
        ...req.query,
        ...req.params
    };
}

// 企業ログイン: POST /company/login
router.post('/login', async (req, res) => {
    const params = getParams(req);
    const { email, password } = params || {};
    // デバッグ: 受信ペイロードのキー一覧とサンプルをログ出力
    try {
        console.log('cServer /login received payload keys:', Object.keys(req.body || {}));
        console.log('cServer /login sample:', { email: req.body?.email, password: req.body?.password ? '[REDACTED]' : undefined });
    } catch (e) {
        console.warn('cServer /login logging failed', e);
    }

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '必須項目が未入力です'
        });
    }

    try {
        const [rows] = await global.db.query(
            'SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)',
            [email]
        );

        if (!rows || rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'メールアドレスまたはパスワードが間違っています'
            });
        }

        const company = rows[0];

        // パスワード検証結果を入れる変数
        let isValidPassword = false;

        // bcrypt ハッシュかどうか判定
        if (
            company.password &&
            typeof company.password === 'string' &&
            company.password.startsWith &&
            company.password.startsWith('$2b$')
        ) {
            isValidPassword = await bcrypt.compare(password, company.password);
        } else {
            // 平文パスワード（旧データ互換）
            isValidPassword = password === company.password;
        }

        // 認証失敗
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'メールアドレスまたはパスワードが間違っています'
            });
        }

        // セッションに企業情報を保存（パスワードは除外）
        req.session.company = {
            id: company.id || company.company_id || null,
            company_name: company.company_name,
            email: company.email
        };

        // レスポンス用（password除外）
        const safeCompany = { ...company };
        delete safeCompany.password;

        return res.json({
            success: true,
            company: safeCompany
        });

    } catch (err) {
        console.error('Company login error:', err && err.stack ? err.stack : err);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー',
            error: String(err)
        });
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
                    const [rows] = await global.db.query(
                        'SELECT * FROM corporations WHERE id = ?',
                        [sess.id]
                    );
                    if (rows && rows.length) companyRow = rows[0];
                }
            } catch (e) {
                console.warn('company whoami DB lookup failed:', e);
            }

            if (companyRow) delete companyRow.password;

            return res.json({
                loggedIn: true,
                company: companyRow || sess
            });
        }

        return res.json({
            loggedIn: false
        });
    } catch (err) {
        console.error('company whoami error:', err);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

module.exports = router;