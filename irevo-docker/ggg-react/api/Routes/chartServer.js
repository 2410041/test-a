const express = require('express');
const router = express.Router();

// ユーザーのチャートデータ取得（Mypage が期待するエンドポイント）
router.get('/chart/:userId', async (req, res) => {
    try {
        console.log('[chart][GET] params: ', req.params);
        const { userId } = req.params;
        const [rows] = await global.db.query(
            'SELECT chart_text, chart_title FROM chart WHERE user_id = ? LIMIT 1',
            [userId]
        );

        if (!userId) return res.status(400).json({
            success: false,
            message: 'user_id が不足しています'
        });

        res.json(rows);
    } catch (error) {
        if (error) {
            console.error('[chart][GET] db error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        if (!row || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            });
        }
    }
});

router.post('/chart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { chart_title, chart_text }= req.body;

        if (!userId || !chart_title || !chart_text) {
            return res.status(400).json({
                success: false,
                message: '項目不足です'
            });
        }

        await global.db.query(
            'INSERT INTO chart (user_id, chart_title, chart_text) VALUES (?, ?, ?)',
            [userId, chart_title, chart_text]
        );

        res.json({
            success: true,
            message: 'チャートデータ保存成功'
        });

    } catch (error) {
        console.error('[chart][POST] error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


/*
app.get('/chart/:userId', (req, res) => {
    console.log('[chart][GET] params:', req.params);
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'missing userId' });

    // user テーブルに chart_text カラム（または personality_scores）がある前提
    const sql = 'SELECT chart_text, personality_scores FROM user WHERE id = ? LIMIT 1';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('[chart][GET] db error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'user not found' });
        }
        // 優先: chart_text があれば返す。なければ personality_scores を JSON 文字列化して返す
        const row = results[0];
        if (row.chart_text) {
            return res.json({ chart_text: row.chart_text });
        }
        // personality_scores が JSON 値の場合はそのまま配列/オブジェクトを返す
        if (row.personality_scores) {
            try {
                const parsed = typeof row.personality_scores === 'string' ? JSON.parse(row.personality_scores) : row.personality_scores;
                return res.json({ chart_text: JSON.stringify(parsed) });
            } catch (e) {
                console.warn('[chart][GET] personality_scores parse error:', e);
                return res.json({ chart_text: '' });
            }
        }
        return res.json({ chart_text: '' });
    });
});
*/

module.exports = router;