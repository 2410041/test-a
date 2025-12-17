const express = require('express');
const router = express.Router();

function jstTime() {
    // 日本時間に補正
    // チャット追加時間を保存するため
    const date = new Date();
    // UTC から JST
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    // jst.toISOString() は常に UTC 表記
    // .slice(0, 19) で先頭から19文字分取得する
    // 例："2025-11-13T15:00:00.000Z".slice(0, 19) → "2025-11-13T15:00:00"
    // .replace('T', ' ') は 'T' をスペースに置換
    const time = jst.toISOString().slice(0, 19).replace('T', ' ');

    return time;
}

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

// 以下 ユーザー側のチャットのルート
// 新しいチャットを開始するルート
router.post('/userChat/start', async (req, res) => {
    try {
        // body から user_id と Companies_id を取得
        const { user_id, Companies_id } = getParams(req);

        // 同じユーザーとチャットがすでに存在しているか確認
        const [rows] = await global.db.query(
            `SELECT * FROM user_chat WHERE user_id = ? AND Companies_id = ?`,
            [user_id, Companies_id]
        );

        // すでにある場合は追加せず、フロントに知らせる
        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "この企業はすでにチャットに追加されています"
            });
        }

        // 新しいチャットを追加
        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, message_text, time) VALUES (?, ?, ?, ?)`,
            [user_id, Companies_id, "", jstTime()]
        );

        res.json({
            success: true,
            message: 'チャットが開始されました'
        });
    } catch (error) {
        console.error('Error in /userChat/start: ', error);

        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// ユーザーのチャットメッセージを保存するルート
router.post('/userChat/message', async (req, res) => {
    try {
        // bodyから ユーザーID 企業ID メッセージ本文 を取得
        const { user_id, Companies_id, message_text, sender_type } = getParams(req);

        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, sender_type, message_text, time) VALUES (?, ?, ?, ?, ?)`,
            [user_id, Companies_id, sender_type, message_text, jstTime()]
        );

        res.json({
            success: true,
            message: 'メッセージが送信されました'
        });
    } catch (error) {
        console.error('Error in /userchat/message: ', error);

        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// ユーザーのチャット履歴を取得するルート
router.get('/userChat/history', async (req, res) => {
    try {
        // クエリから ユーザーID 企業ID を取得
        const { user_id, Companies_id } = getParams(req);

        const [rows] = await global.db.query(
            `SELECT * FROM user_chat WHERE user_id = ? AND Companies_id = ? ORDER BY time ASC`,
            [user_id, Companies_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error in /userChat/history: ', error);

        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// チャットした企業一覧取得
router.get('/userChat/companies', async (req, res) => {
    try {
        const { user_id } = getParams(req);

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id が不足しています'
            });
        }

        const [rows] = await global.db.query(
            `SELECT DISTINCT c.id, c.c_name 
             FROM Companies AS c 
             JOIN user_chat uc ON c.id = uc.Companies_id 
             WHERE uc.user_id = ?`,
            [user_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error in /userChat/companies: ', error);

        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 以下 企業側のチャットのルート
// 応募者一覧を取得するルート
router.get('/companyChat/users', async (req, res) => {
    try {
        const { Companies_id, companies_id } = getParams(req);

        const companyId = Companies_id || companies_id;

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Companies_id が不足しています"
            });
        }

        const sql = `
            SELECT DISTINCT 
                u.id,
                u.u_Fname,
                u.u_Lname,
                u.u_nick,
                CONCAT(u.u_Fname, ' ', u.u_Lname) AS display_name
            FROM User AS u
            JOIN user_chat AS uc ON u.id = uc.user_id
            WHERE uc.Companies_id = ?
        `;

        const [rows] = await global.db.query(sql, [companyId]);

        res.json(rows);
    } catch (error) {
        console.error('Error in /companyChat/users:', error);

        res.status(500).json({
            success: false,
            message: 'server error',
            detail: error.message
        });
    }
});

// 企業のチャットメッセージを保存するルート
router.post('/companyChat/message', async (req, res) => {
    try {
        // body から ユーザーID 企業ID メッセージ本文 送信者タイプ を取得
        const { user_id, Companies_id, message_text, sender_type } = getParams(req);

        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, sender_type, message_text, time) VALUES (?, ?, ?, ?, ?)`,
            [user_id, Companies_id, sender_type, message_text, jstTime()]
        );

        res.json({
            success: true,
            message: 'メッセージが送信されました'
        });
    } catch (error) {
        console.log('Error in /companyChat/message: ', error);

        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;