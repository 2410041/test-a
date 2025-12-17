const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// 一覧 GET /user/ (userGet → / に変更)
router.get('/', async (req, res) => {
    try {
        const [rows] = await global.db.query(
            'SELECT id, u_Fname, u_Lname, u_kana, u_nick, Birthday, Gender, u_Contact, u_Email, Employment, u_Address FROM User ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('ユーザー一覧取得エラー:', err);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// 1件取得 GET /user/:id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await global.db.query(
            'SELECT id, u_Fname, u_Lname, u_kana, u_nick, Birthday, Gender, u_Contact, u_Email, Employment, u_Address FROM User WHERE id = ?',
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ success: false, message: 'not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('ユーザー取得エラー:', err);
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザー作成 POST /user
router.post('/', async (req, res) => {
    try {
        const cols = [];
        const vals = [];
        const q = [];
        const allow = ['u_Fname','u_Lname','u_kana','u_nick','Birthday','Gender','u_Contact','u_Email','Employment','u_Address'];
        
        for (const k of allow) {
            if (req.body[k] !== undefined) { 
                cols.push(k); 
                vals.push(req.body[k]); 
                q.push('?'); 
            }
        }
        
        if (req.body.u_Password) {
            const hashed = await bcrypt.hash(req.body.u_Password, 10);
            cols.push('u_Password'); 
            vals.push(hashed); 
            q.push('?');
        }
        
        if (!cols.length) return res.status(400).json({ success: false, message: 'no fields' });
        
        const [r] = await global.db.query(`INSERT INTO User (${cols.join(',')}) VALUES (${q.join(',')})`, vals);
        const [rows] = await global.db.query(
            'SELECT id, u_Fname, u_Lname, u_kana, u_nick, Birthday, Gender, u_Contact, u_Email, Employment, u_Address FROM User WHERE id = ?',
            [r.insertId]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('ユーザー作成エラー:', err);
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 更新 PUT /user/:id
router.put('/:id', async (req, res) => {
    try {
        const allow = ['u_Fname', 'u_Lname', 'u_kana', 'u_nick', 'Birthday', 'Gender', 'u_Contact', 'u_Email', 'Employment', 'u_Address'];
        const sets = [];
        const vals = [];
        
        for (const k of allow) {
            if (req.body[k] !== undefined) { 
                sets.push(`${k} = ?`); 
                vals.push(req.body[k]); 
            }
        }
        
        if (req.body.u_Password) {
            const hashed = await bcrypt.hash(req.body.u_Password, 10);
            sets.push('u_Password = ?'); 
            vals.push(hashed);
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

// 企業一覧（ユーザー別）
router.get('/user_chat/companies', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id が不足しています'
            });
        }

        const [rows] = await global.db.query(
            `SELECT DISTINCT c.id, c.c_name FROM Companies AS c JOIN user_chat uc ON c.id = uc.Companies_id WHERE uc.user_id = ?`,
            [user_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error in /user_chat/companies:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// チャット開始 POST /user/user_chat/start
router.post('/user_chat/start', async (req, res) => {
    try {
        const { user_id, Companies_id } = req.body;

        // 重複チェック
        const [existing] = await global.db.query(
            "SELECT * FROM user_chat WHERE user_id=? AND Companies_id=?",
            [user_id, Companies_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "この企業は既にチャットに追加されています"
            });
        }

        // 日本時間 (JST) に補正
        const now = new Date();
        const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const time = jst.toISOString().slice(0, 19).replace('T', ' ');

        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, message_text, time) VALUES (?, ?, ?, ?)`,
            [user_id, Companies_id, "", time]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error in /user_chat/start:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// メッセージ送信 POST /user/user_chat/message
router.post('/user_chat/message', async (req, res) => {
    try {
        const { user_id, Companies_id, message_text } = req.body;

        const date = new Date();
        const jstOffset = 9 * 60 * 60 * 1000;
        const jst = new Date(date.getTime() + jstOffset);
        const time = jst.toISOString().slice(0, 19).replace('T', ' ');

        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, message_text, time) VALUES (?, ?, ?, ?)`,
            [user_id, Companies_id, message_text, time]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error in /user_chat/message:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// チャット履歴取得
router.get('/user_chat/history', async (req, res) => {
    try {
        const { user_id, Companies_id } = req.query;

        console.log("Fetching chat history for user_id:", user_id, "Companies_id:", Companies_id);

        const [rows] = await global.db.query(
            `SELECT * FROM user_chat WHERE user_id = ? AND Companies_id = ? ORDER BY time ASC`,
            [user_id, Companies_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error in /user_chat/history:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});
module.exports = router;