const express = require('express');
const router = express.Router();

// POST /calendarEvent
// クライアントから受け取ったイベント情報をDBに挿入するエンドポイント
router.post('/calendarEvent', async (req, res) => {
    try {
        // リクエストボディから必要なフィールドを取得
        const { user_id, Companies_id, event_date, event_text } = req.body;

        // 必須項目の存在チェック。足りなければ400を返す
        if (!user_id || !Companies_id || !event_date || !event_text) {
            return res.status(400).json({ success: false, message: '必須項目が不足しています' });
        }

        // DBへ挿入。プレースホルダを使ってSQLインジェクションを防ぐ
        await global.db.query(
            'INSERT INTO calendarEvents (user_id, Companies_id, event_date, event_text) VALUES (?, ?, ?, ?)',
            [user_id, Companies_id, event_date, event_text]
        );

        // 成功レスポンスを返す
        res.json({ success: true, message: 'イベントが追加されました' });
    } catch (error) {
        // サーバー側のログにエラーを記録し、汎用的なエラーメッセージで応答する
        console.error('Error adding calendar event:', error);
        res.status(500).json({
            success: false, message: 'イベントの追加に失敗しました'
        });
    }
});

// GET /calendarEvent
// 指定ユーザー・企業のイベント一覧（event_date と event_text）を取得するエンドポイント
router.get('/calendarEvent', async (req, res) => {
    try {
        // クエリパラメータから user_id と Companies_id を取得
        const { user_id, Companies_id } = req.query;

        // DBから該当するイベントを取得
        const [rows] = await global.db.query(
            'SELECT event_date, event_text FROM calendarEvents WHERE user_id = ? AND Companies_id = ?',
            [user_id, Companies_id]
        );

        // 取得した行データをそのまま返す
        res.json(rows);
    } catch (error) {
        // エラー発生時は500を返す（ここでは error が存在する場合のみ処理しているが、
        // 実質的には常にエラーなので単純に500を返す形でOK）
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'サーバーエラー'
            });
        }
    }
});

// POST /companyMemo
// 会社関連のメモをDBに追加するエンドポイント
router.post('/companyMemo', async (req, res) => {
    try {
        // リクエストボディから必要なフィールドを取得
        const { user_id, Companies_id, memo_text, create_at } = req.body;
        // 必須項目の存在チェック
        if (!user_id || !Companies_id || !memo_text || !create_at) {
            return res.status(400).json({
                success: false,
                message: '項目が不足しています'
            });
        }

        // Memoテーブルへ挿入
        await global.db.query(
            'INSERT INTO Memo (user_id, Companies_id, memo_text, create_at) VALUES (?, ?, ?, ?)',
            [user_id, Companies_id, memo_text, create_at]
        );

        // 成功レスポンス
        res.json({
            success: true,
            message: 'メモが追加されました'
        });
    } catch (error) {
        // エラーログと汎用エラーメッセージを返す
        console.error('Error adding Memo');
        res.status(500).json({
            success: false,
            message: 'メモの追加に失敗しました'
        });
    }
});

// GET /companyMemo
// メモとカレンダーイベントを結合して取得するエンドポイント
router.get('/companyMemo', async (req, res) => {
    try {
        // クエリパラメータから user_id を取得（既存コードは日付条件も使っているので、呼び出し側で必要なパラメータを渡すこと）
        const { user_id, date } = req.query;

        // Memo と calendarEvents を JOIN してデータを取得（取得後はクライアントに返却）
        const [results] = await global.db.query(
            `SELECT ce.event_date, ce.event_text, m.memo_text FROM Memo AS m JOIN calendarEvents AS ce ON m.calendarEvents_id = ce.id WHERE ce.user_id = ? AND DATE(ce.event_date) = ? ORDER BY ce.event_date ASC`,
            [user_id, date]
        );

        // 取得結果を返す
        res.json(results);
    } catch (error) {
        // エラーログを出力して500を返す
        console.error('Error fetching company_memos:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

module.exports = router;