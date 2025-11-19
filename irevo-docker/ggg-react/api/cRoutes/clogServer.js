const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// 企業ログイン : post /company/login
router.post('/company/login', async (req, res) => {
    // フロント側のキーに合わせる
    const { email, password } = req.body;

    // 入力チェック
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '未項目です'
        });
    }

    try {
        // DBから企業情報を取得
        const [rows] = await global.db.query(
            `SELECT * FROM corporations WHERE LOWER(email) = LOWER(?)`,
            [email]
        );

        if (!rows || rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: '認証に失敗しました。'
            });
        }

        // 取得した企業レコード
        const company = rows[0];

        // パスワードが「bcryptでハッシュ化されているか」をチェック
        // bcrypt のハッシュは "$2b$" で始まるため、これで判別できる
        const passwordIsHashed = company.password.startsWith("$2b$");

        // パスワード検証の結果を入れる変数
        let isValidPassword;

        // もしハッシュ化されているなら bcrypt で比較する
        if (passwordIsHashed) {
            // bcrypt の場合、パスワードはそのままでは比較できない
            // bcrypt.compare(入力されたパスワード, DBに保存されているハッシュパスワード)
            isValidPassword = await bcrypt.compare(password, company.password);
        } else {
            /* ▼ 平文パスワード（古いデータ用）のチェックユーザーが入力したパスワード（password）と
                データベースに保存されているパスワード（company.password）をそのまま文字として比較する。
                完全に一致したら true（正しいパスワード）、一致しなければ false（間違い）。 */
            isValidPassword = (password === company.password);
        }

        // パスワード認証確認
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: '認証に失敗しました'
            });
        }

        // セッションに企業情報を保存（ログイン成功）
        req.session.company = { ...company };

        // パスワードはセッションに保存しないように削除
        delete req.session.company.password;

        // クライアント側に返す安全な企業情報（password を除外）
        const safeCompany = { ...company };
        delete safeCompany.password;

        // レスポンスを返す
        return res.json({
            success: true,
            company: safeCompany
        });

    } catch (error) {
        console.error('Error in /comapany/login: ', error);
        return res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

router.get('/company/whoami', async (req, res) => {
    try {
        // ログイン時にセッションに保存された企業情報を返す
        if (req.session.company) {
            res.json({
                loggedIn: true,
                company: req.session.company,
                message: '企業はログイン中です'
            });
        } else {
            // セッションにユーザー情報がない場合
            res.json({
                loggedIn: false,
                message: '企業はログインしていません'
            });
        }
    } catch (error) {
        console.error('Error in /company/whoami: ', error);
        return res.json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;