const express = require('express');
const router = express.Router();
// パスワードハッシュ化
const bcrypt = require('bcrypt');

// 新規登録API
router.post('/newRegistration', async (req, res) => {
    try {
        const { u_Lname, u_Fname, u_kana, u_nick, u_Password, u_Email, Gender, Birthday, u_Contact, u_Address, Employment } = req.body;

        // 入力チェック
        if ( !u_Lname || !u_Fname || !u_kana || !u_nick || !u_Email || !u_Password ) {
            return res.status(400).json({
                success: false,
                message: '必須項目が未入力です'
            });
        }

        // メールアドレスの重複チェック
        const [checkEmail] = await global.db.query(
            `SELECT id FROM User WHERE LOWER(u_Email) = LOWER(?)`,
            [u_Email]
        );

        if (checkEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'このメールアドレスは既に登録されています'
            });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(u_Password, 10);

        // ユーザー情報登録
        await global.db.query(
            `INSERT INTO User (u_Lname, u_Fname, u_kana, u_nick, u_Password, u_Email, Gender, Birthday, u_Contact, u_Address, Employment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [u_Lname, u_Fname, u_kana, u_nick, hashedPassword, u_Email, Gender, Birthday, u_Contact, u_Address, Employment]
        );

        return res.json({
            success: true,
            message: 'ユーザー登録が完了しました'
        });
    } catch (error) {
        console.error(`Error in /newRegistration: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// ログイン処理
router.post('/login', async (req, res) => {
    // フロント側キーに合わせる
    const { email, password } = req.body;

    // 入力チェック
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '必須項目が未入力です'
        });
    }

    try {
        // DBからユーザー情報を取得
        const [result] = await global.db.query(
            // 大文字・小文字を区別せずにメールアドレスを照合
            'SELECT * FROM User WHERE LOWER(u_Email) = LOWER(?)',
            [email]
        );

        // ユーザーが存在しない場合
        if (!result || result.length === 0) {
            return res.json({
                success: false,
                message: 'メールアドレスまたはパスワードが間違っています'
            });
        }

        // クエリ結果から先頭のレコードを取り出し、後続の検証用フラグを初期化しています。
        // result が配列（例: DBクエリの戻り値）である前提で、先頭要素を user に代入します。
        const user = result[0];

        // パスワードが存在するか確認
        // if (!user.u_Password || typeof user.u_Password !== 'string') {
        //     return res.json({
        //         success: false,
        //         message: 'メールアドレスまたはパスワードが間違っています'
        //     });
        // }
        // ↑ 不要？

        // これから行うチェック（例: パスワード照合）が成功したかを示すブール値フラグ。
        // 後で true に書き換える可能性があるため let を使用しています。
        let isValid = false;

        if (user.u_Password.startsWith && user.u_Password.startsWith('$2b$')) {
            // bcryptハッシュの場合
            isValid = await bcrypt.compare(password, user.u_Password);
        } else {
            // 平文の場合
            isValid = password === user.u_Password;
        }

        // ログイン情報結果判定
        // 不正な場合
        if (!isValid) {
            return res.json({
                success: false,
                message: 'メールアドレスまたはパスワードが間違っています'
            });
        }

        // ログイン成功：セッションに保存
        // セッションにユーザー情報を保存
        req.session.user = { ...user };
        // セッションにパスワードは不要
        delete req.session.user.u_Password;
        // レスポンスにも含めない 
        delete user.u_Password; 

        // レスポンスをJSON形式で返す
        return res.json({
            success: true,
            user
        });

    } catch (error) {
        // error 処理
        console.error('Database query error: ', error);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// ログイン中のユーザー情報取得API
router.get('/whoami', (req, res) => {
    // ログイン時にセッションに保存されたユーザー情報を返す
    if (req.session.user) {
        res.json({
            loggedIn: true,
            user: req.session.user,
            message: 'ユーザーはログイン中です'
        });
    } else {
        // セッションにユーザー情報がない場合
        res.json({
            loggedIn: false,
            message: 'ユーザーはログインしていません'
        });
    }
});

// ログアウト処理API
router.post('/logout', (req, res) => {
    // セッションを破棄してログアウト
    // req.session : ログイン情報がサーバーに保存されている箱のようなもの
    // destroy : その箱を空にするイメージ
    req.session.destroy(error => {
        if (error) {
            // もしエラーが発生した場合
            return res.status(500).json({
                success: false,
                message: 'ログアウトできませんでした'
            });
        }

        // cookiesのデータクリア
        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'ログアウトしました'
        });
    });
});

module.exports = router;
