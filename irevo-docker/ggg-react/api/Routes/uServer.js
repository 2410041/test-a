const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// 一覧 GET /user
router.get('/userGet', async (req, res) => {
    try {
        const [rows] = await global.db.query(
            'SELECT id, u_Fname, u_Lname, u_kana, u_nick, Birthday, Gender, u_Contact, u_Email, Employment, u_Address FROM User ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('ユーザー一覧取得エラー:', err);
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const allow = ['u_Fname', 'u_Lname', 'u_kana', 'u_nick', 'Birthday', 'Gender', 'u_Contact', 'u_Email', 'Employment', 'u_Address'];
        const sets = [];
        const vals = [];
        for (const k of allow) {
            if (req.body[k] !== undefined) { sets.push(`${k} = ?`); vals.push(req.body[k]); }
        }
        if (req.body.u_Password) {
            const hashed = await bcrypt.hash(req.body.u_Password, 10);
            sets.push('u_Password = ?'); vals.push(hashed);
        }
        if (!sets.length) return res.status(400).json({ success: false, message: 'no fields' });
        vals.push(req.params.id);
        await global.db.query(`UPDATE User SET ${sets.join(', ')} WHERE id = ?`, vals);
        const [rows] = await global.db.query(
            'SELECT id, u_Fname, u_Lname, u_kana, u_nick, Birthday, Gender, u_Contact, u_Email, Employment, u_Address FROM User WHERE id = ?',
            [req.params.id]
        );
        res.json(rows[0] || { id: Number(req.params.id) });
    } catch (err) {
        console.error('ユーザー更新エラー:', err);
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 企業一覧（ユーザー別）
router.get('/user_chat/companies', async (req, res) => {
    try {
        // クエリパラメータ（URLの?以降の情報）からuser_idを取得
        // 例: http://localhost:3030/user/user_chat/companies?user_id=3
        // → user_id には 3 が入る
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id が不足しています'
            });
        }

        // MySQLデータベースに対してクエリ（問い合わせ）を実行
        // 「user_chat」テーブルと「Companies」テーブルを結合して
        // 指定されたユーザー（user_id）がチャットした企業（Companies）を取得する
        const [rows] = await global.db.query(
            `SELECT DISTINCT c.id, c.c_name FROM Companies AS c JOIN user_chat uc ON c.id = uc.Companies_id WHERE uc.user_id = ?`,
            // ? の部分に user_id が入る
            [user_id]
            // ↑ ここで ? に実際の値を渡している（SQLインジェクション対策）
        );

        // データベースから取得した結果(rows)をJSON形式でフロントエンドに返す
        // 例: [{ id: 1, c_name: "株式会社A" }, { id: 2, c_name: "株式会社B" }]
        res.json(rows);

    } catch (error) {
        // もしデータベースエラーなどが発生した場合は、エラーメッセージを出力
        console.error('Error in /user_chat/companies:', error);

        // フロントエンド側にも「サーバーエラー」というメッセージを返す
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// チャット開始
router.post('/user_chat/start', async (req, res) => {
    try {
        // クエリパラメータから「ユーザーID」と「企業ID」を取得
        // 例: http://localhost:3030/user/user_chat/start?user_id=5&Companies_id=3
        // → user_id = 5, Companies_id = 3
        const { user_id, Companies_id } = req.body;

        // --- 追加：同じユーザーと企業のチャットが既に存在するか確認 ---
        const [existing] = await global.db.query(
            "SELECT * FROM user_chat WHERE user_id=? AND Companies_id=?",
            [user_id, Companies_id]
        );

        if (existing.length > 0) {
            // 既にある場合は追加せず、フロントに知らせる
            return res.status(400).json({
                success: false,
                message: "この企業は既にチャットに追加されています"
            });
        }
        // --- ここまで重複チェック ---

        // チャットの開始時刻として保存するため
        // 日本時間 (JST) に補正
        const now = new Date();
        // UTC→JST
        const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const time = jst.toISOString().slice(0, 19).replace('T', ' ');

        // データベースの user_chat テーブルに新しいレコードを追加
        // （ユーザーと企業の新しいチャットを「空のメッセージ」で開始する）
        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, message_text, time) VALUES (?, ?, ?, ?)`,
            // ↑ ? はプレースホルダ（後で値を安全に挿入）
            // 各 ? に代入する値を配列で指定
            [user_id, Companies_id, "", time]
        );

        // 処理が成功した場合、フロントに成功レスポンスを返す
        res.json({ success: true });

    } catch (error) {
        // もしエラー（DB接続失敗など）が起きた場合、サーバー側でログ出力
        console.error('Error in /user_chat/start:', error);

        // フロントエンドにもエラーをJSON形式で返す
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// メッセージ送信
router.post('/user_chat/message', async (req, res) => {
    try {
        // クエリパラメータから「ユーザーID」「企業ID」「メッセージ本文」を取得
        // 例: http://localhost:3030/user/user_chat/message?user_id=5&Companies_id=3&message_text=こんにちは
        const { user_id, Companies_id, message_text, sender_type } = req.body;

        // メッセージ送信時刻として保存するため
        // 日本時間を 'YYYY-MM-DD HH:mm:ss' 形式で取得
        const date = new Date();
        const jstOffset = 9 * 60 * 60 * 1000; // 9時間（ミリ秒）
        const jst = new Date(date.getTime() + jstOffset);
        const time = jst.toISOString().slice(0, 19).replace('T', ' ');

        // user_chat テーブルに新しいメッセージを追加
        // 各 ? に対して配列内の値を安全に挿入してSQLインジェクションを防ぐ
        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, sender_type, message_text, time) VALUES (?, ?, ?, ?, ?)`,
            [user_id, Companies_id, sender_type, message_text, time]
        );

        // データベースへの挿入が成功した場合、成功レスポンスを返す
        res.json({ success: true });

    } catch (error) {
        // もしDBエラーなどが発生した場合、サーバー側にエラーログを出力
        console.error('Error in /user_chat/message:', error);

        // クライアント（フロント側）にもエラーレスポンスを返す
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// チャット履歴取得
router.get('/user_chat/history', async (req, res) => {
    try {
        // クエリパラメータ（URLの?以降）から user_id と Companies_id を取得
        // 例: http://localhost:3030/user/user_chat/history?user_id=5&Companies_id=3
        // → user_id = 5, Companies_id = 3
        const { user_id, Companies_id } = req.query;

        // 取得したパラメータをサーバーのコンソールに出力（デバッグ用）
        console.log("Fetching chat history for user_id:", user_id, "Companies_id:", Companies_id);

        // user_chat テーブルから指定されたユーザーと企業のチャット履歴を取得
        // 条件：
        //   user_id が一致する
        //   Companies_id が一致する
        // 結果は time（送信時刻）の昇順（古い順）に並べる
        const [rows] = await global.db.query(
            `SELECT * FROM user_chat WHERE user_id = ? AND Companies_id = ? ORDER BY time ASC`,
            // ↑ ? に安全に値を挿入（SQLインジェクション対策）
            [user_id, Companies_id]
        );

        // 取得した履歴データ（rows）をJSON形式でフロントエンドに返す
        // 例: [{ id: 1, message_text: "こんにちは", time: "2025-10-22T08:00:00Z" }, ...]
        res.json(rows);

    } catch (error) {
        // データベース接続エラーなどが発生した場合、サーバーのコンソールにエラーを出力
        console.error('Error in /user_chat/history:', error);

        // フロントエンド側に「サーバーエラー」を返す
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// POST /user_update : DB を更新し、成功時にセッション内の user を最新データで上書きして返す
router.post('/user_update', async (req, res) => {
    try {
        const body = req.body || {};
        console.log('POST /user_update 受信:', body);

        // 識別用メール（originalEmail があれば優先）
        const identifier = (body.originalEmail && String(body.originalEmail).trim() !== '')
            ? String(body.originalEmail).trim()
            : (body.email && String(body.email).trim() !== '' ? String(body.email).trim() : null);

        if (!identifier) {
            return res.status(400).json({ success: false, message: '識別用のメールアドレスが必要です' });
        }

        // --- DB 更新（簡素版） ---
        const sets = [];
        const params = [];

        if (body.name && String(body.name).trim() !== '') {
            const parts = String(body.name).trim().split(/\s+/);
            sets.push('u_Fname = ?', 'u_Lname = ?');
            params.push(parts[0], parts.slice(1).join(' ') || '');
        }

        const map = {
            kana: 'u_kana', dob: 'Birthday', gender: 'Gender', zipCode: 'u_zip',
            prefecture: 'u_prefecture', city: 'u_city', street: 'u_street',
            building: 'u_building', phone: 'u_Contact', employmentStatus: 'Employment'
        };

        for (const [k, col] of Object.entries(map)) {
            const v = body[k];
            if (v !== undefined && v !== null && String(v).trim() !== '') {
                sets.push(`${col} = ?`);
                params.push(v);
            }
        }

        if (body.email && String(body.email).trim() !== '') {
            sets.push('u_Email = ?');
            params.push(String(body.email).trim());
        }

        if (sets.length === 0) {
            return res.status(400).json({ success: false, message: '更新するフィールドがありません' });
        }

        const sql = `UPDATE User SET ${sets.join(', ')} WHERE u_Email = ?`;
        const sqlParams = params.concat(identifier);
        const [result] = await global.db.query(sql, sqlParams);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '対象ユーザーが見つかりませんでした' });
        }

        // --- DB から最新ユーザーを取得 ---
        const finalEmail = (body.email && String(body.email).trim() !== '') ? String(body.email).trim() : identifier;
        const [rows] = await global.db.query('SELECT * FROM User WHERE u_Email = ?', [finalEmail]);
        const updatedUser = rows && rows[0] ? rows[0] : null;

        if (!updatedUser) {
            return res.status(500).json({ success: false, message: '更新後のユーザー取得に失敗しました' });
        }

        // --- セッション更新 ---
        // 何をセッションに入れているかはアプリ依存。ここでは req.session.user を上書きする。
        if (req && req.session) {
            // パスワードはセッションに入れない
            if (updatedUser.u_Password) delete updatedUser.u_Password;
            req.session.user = updatedUser;                 // セッション上書き
            if (typeof req.session.save === 'function') {  // ストアによっては save が必要
                req.session.save(err => { if (err) console.error('session save error:', err); });
            }
        }

        // クライアントに最新の user を返す（フロントで即表示更新できる）
        return res.json({ success: true, message: 'ユーザー情報を更新しました', user: updatedUser });
    } catch (err) {
        console.error('Error in /user_update POST:', err);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 削除 DELETE /user/:id
router.delete('/:id', async (req, res) => {
    try {
        await global.db.query('DELETE FROM User WHERE id = ?', [req.params.id]);
        res.json({ success: true, id: Number(req.params.id) });
    } catch (err) {
        console.error('ユーザー削除エラー:', err);
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

module.exports = router;