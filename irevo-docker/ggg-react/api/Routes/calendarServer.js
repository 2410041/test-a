const express = require('express');
const router = express.Router();

// パラメータ取得ヘルパー追加
function getParams(req) {
    return {
        ...req.query,
        ...req.body,
        ...req.body?.params,
        ...req.params
    };
}

// POST /calendarEvent
// クライアントから受け取ったイベント情報をDBに挿入するエンドポイント
router.post('/calendarEvent', async (req, res) => {
    try {
        // デバッグログ: 受信したボディを出力
        console.log('POST /calendar_event body:', JSON.stringify(req.body));

        const { user_id, Companies_id, event_date, event_text, event_txt, event_detail } = getParams(req);

        if (user_id && Companies_id && event_date && (event_txt || event_text)) {
            const txtToInsert = event_txt ?? event_text;
            const detailToInsert = event_detail ?? '';

            try {
                await global.db.query(
                    'INSERT INTO calendarEvents (user_id, Companies_id, event_date, event_txt, event_detail) VALUES (?, ?, ?, ?, ?)',
                    [user_id, Companies_id, event_date, txtToInsert, detailToInsert]
                );
                return res.json({
                    success: true,
                    message: 'イベントが追加されました'
                });
            } catch (errInner) {
                console.warn('Insert with event_txt/event_detail failed, falling back:', errInner);

                try {
                    await global.db.query(
                        'INSERT INTO calendarEvents (user_id, Companies_id, event_date, event_text, event_detail) VALUES (?, ?, ?, ?, ?)',
                        [user_id, Companies_id, event_date, txtToInsert, detailToInsert]
                    );
                    return res.json({
                        success: true,
                        message: 'イベントが追加されました (fallback)'
                    });
                } catch (errFallback) {
                    console.error('Fallback insert also failed:', errFallback);
                    return res.status(500).json({
                        success: false,
                        message: 'イベントの追加に失敗しました',
                        error: String(errFallback)
                    });
                }
            }
        }

        return res.status(400).json({ success: false, message: '必須項目が不足しています' });
    } catch (error) {
        console.error('Error adding calendar event:', error);
        res.status(500).json({
            success: false,
            message: 'イベントの追加に失敗しました',
            error: String(error)
        });
    }
});

// GET /calendarEvent
// 指定ユーザー・企業のイベント一覧
router.get('/calendarEvent', async (req, res) => {
    try {
        const { user_id, Companies_id } = getParams(req);

        try {
            const [rows] = await global.db.query(
                'SELECT id, event_date, event_txt AS event_txt, event_detail AS event_detail FROM calendarEvents WHERE user_id = ? AND Companies_id = ?',
                [user_id, Companies_id]
            );
            console.log('GET /calendar_event returned (new cols):', rows.length);
            return res.json(rows);
        } catch (errQuery) {
            console.warn('Query new cols failed, fallback:', errQuery);

            const [rowsOld] = await global.db.query(
                'SELECT id, event_date, event_text AS event_txt, event_detail FROM calendarEvents WHERE user_id = ? AND Companies_id = ?',
                [user_id, Companies_id]
            );
            console.log('GET /calendar_event returned (old cols):', rowsOld.length);
            return res.json(rowsOld);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// POST /companyMemo
// 会社関連のメモをDBに追加するエンドポイント
router.post('/companyMemo', async (req, res) => {
    try {
        const { user_id, Companies_id, memo_text, create_at } = getParams(req);

        if (!user_id || !Companies_id || !memo_text || !create_at) {
            return res.status(400).json({
                success: false,
                message: '項目が不足しています'
            });
        }

        await global.db.query(
            'INSERT INTO Memo (user_id, Companies_id, memo_text, create_at) VALUES (?, ?, ?, ?)',
            [user_id, Companies_id, memo_text, create_at]
        );

        res.json({
            success: true,
            message: 'メモが追加されました'
        });
    } catch (error) {
        console.error('Error adding Memo');
        res.status(500).json({
            success: false,
            message: 'メモの追加に失敗しました'
        });
    }
});

// GET /companyMemo
router.get('/companyMemo', async (req, res) => {
    try {
        const { user_id, date } = getParams(req);

        const [results] = await global.db.query(
            `SELECT ce.event_date, ce.event_text, m.memo_text 
             FROM Memo AS m 
             JOIN calendarEvents AS ce ON m.calendarEvents_id = ce.id 
             WHERE ce.user_id = ? AND DATE(ce.event_date) = ? 
             ORDER BY ce.event_date ASC`,
            [user_id, date]
        );

        res.json(results);
    } catch (error) {
        console.error('Error fetching company_memos:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

// DELETE /calendarEvent
router.delete('/calendarEvent', async (req, res) => {
    try {
        const { id, user_id, Companies_id } = getParams(req);

        if (!id || !user_id || !Companies_id) {
            return res.status(400).json({
                success: false,
                message: 'id, user_id, Companies_id が必要です'
            });
        }

        const [result] = await global.db.query(
            'DELETE FROM calendarEvents WHERE id = ? AND user_id = ? AND Companies_id = ?',
            [id, user_id, Companies_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'イベントが削除されました' });
        }
        return res.status(404).json({ success: false, message: '該当イベントが見つかりません' });
    } catch (err) {
        console.error('Error deleting calendar event:', err);
        return res.status(500).json({
            success: false,
            message: 'イベント削除に失敗しました',
            error: String(err)
        });
    }
});

module.exports = router;