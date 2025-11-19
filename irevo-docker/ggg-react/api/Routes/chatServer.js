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
    
// 以下 ユーザー側のチャットのルート
// 新しいチャットを開始するルート
router.post('/userChat/start', async (req, res) => {
    try {
        // body から user_id と Companies_id を取得
        const { user_id, Companies_id } = req.body;

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

        // 追加できた場合、フロントに成功レスポンスを返す
        res.json({
            success: true,
            message: 'チャットが開始されました'
        });
    } catch (error) {
        // DB接続エラーなどが起きた場合、サーバー側でログを出力
        console.error('Error in /userChat/start: ', error);

        // フロントにもエラーを出力
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
        const { user_id, Companies_id, message_text, sender_type } = req.body;

        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, sender_type, message_text, time) VALUES (?, ?, ?, ?, ?)`,
            [user_id, Companies_id, sender_type, message_text, jstTime()]
        );

        // DBへの挿入が成功した場合、レスポンスを返す
        res.json({
            success: true,
            message: 'メッセージが送信されました'
        });
    } catch (error) {
        // DBエラーなどが発生した場合、サーバーにログ出力
        console.error('Error in /userchat/message: ', error);
        
        // フロントにエラーを返す
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
        const { user_id, Companies_id } = req.query;

        // テーブルから指定されたユーザーと企業のチャット履歴を取得
        const [rows] = await global.db.query(
            `SELECT * FROM user_chat WHERE user_id = ? AND Companies_id = ? ORDER BY time ASC`,
            [user_id, Companies_id]
        );

        // 取得した履歴データ (rows) を JSON 形式でフロント側に返す
        res.json(rows);
    } catch (error) {
        // DBエラーなどが発生した場合、エラー出力
        console.error('Error in /userChat/history: ', error);

        // フロントにエラーを返す
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

router.get('/userChat/companies', async (req, res) => {
    try {
        // クエリから (URLの?以降の情報) から user_id を取得
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id が不足しています'
            });
        }

        // 「 user_id 」テーブルと 「 Companies 」テーブルを結合
        // 指定されたユーザー (user_id) がチャットした企業 (Companies) を取得する
        const [rows] = await global.db.query(
            `SELECT DISTINCT c.id, c.c_name FROM Companies AS c JOIN user_chat uc ON c.id = uc.Companies_id WHERE uc.user_id = ?`,
            [user_id]
        );

        res.json(rows);
    } catch (error) {
        // DBエラーなどが発生した場合は、ログ出力
        console.error('Error in /userChat/companies: ', error);
        
        // フロントにもエラーを返す
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
        // クエリから 企業ID を取得
        const { Companies_id } = req.query;

        // テーブルから指定されている企業とチャットしているユーザーの一覧を取得する
        const [raws] = await global.db.query(
            `SELECT DISTINCT u.id, u.u_Fname, u.u_Lname, u.u_nick FROM Users AS u JOIN user_chat AS uc ON u.id = uc.user_id WHERE uc.Companies_id = ?`,
            [Companies_id]
        );

        // データベースから取得した結果 (raws) を JSON 形式でフロントに返す
        res.json(raws);
    } catch (error) {
        // DBエラーなどが発生した場合、ログ出力
        console.error('Error in /companyChat/users: ', error);
        
        // フロントにエラーを返す
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 企業のチャットメッセージを保存するルート
router.post('/companyChat/message', async (req, res) => {
    try {
        // body から ユーザーID 企業ID メッセージ本文 送信者タイプ を取得
        const { user_id, Companies_id, message_text, sender_type } = req.body;

        // データ挿入
        await global.db.query(
            `INSERT INTO user_chat (user_id, Companies_id, sender_type, message_text, time) VALUES (?, ?, ?, ?, ?)`,
            [user_id, Companies_id, sender_type, message_text, jstTime()]
        );

        // データ挿入成功した場合、レスポンスを返す。
        res.json({
            success: true,
            message: 'メッセージが送信されました'
        });
    } catch (error) {
        // DBエラーなどが発生した場合、ログ出力
        console.log('Error in /companyChat/message: ', error);
        
        // レスポンス、フロントにエラーを返す
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;