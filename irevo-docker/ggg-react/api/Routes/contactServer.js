const express = require('express');
const router = express.Router();

// お問い合わせ一覧取得
router.get('/contacts', async (req, res) => {
    try {
        if (!global.db) {
            return res.status(500).json({ error: 'データベース未初期化' });
        }

        const { filter = 'all', search = '' } = req.query;

        console.log('Fetching contacts with filter:', filter, 'search:', search);

        let query = 'SELECT * FROM Contact WHERE 1=1';
        const params = [];

        if (filter === 'new') {
            query += ' AND (status = "new" OR status IS NULL)';
        } else if (filter === 'replied') {
            query += ' AND status = "replied"';
        }

        if (search) {
            query += ' AND (uName LIKE ? OR title LIKE ? OR email LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY time DESC';

        console.log('SQL Query:', query);

        const [results] = await global.db.query(query, params);

        console.log('Query results:', results);

        const formattedResults = results.map(contact => ({
            id: contact.id,
            userName: contact.uName,
            email: contact.email,
            subject: contact.title,
            message: contact.message,
            status: contact.status || 'new',
            createdAt: contact.time,
            category: contact.select_p
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error('Error in /contacts:', error);
        res.status(500).json({ error: 'サーバーエラー', details: error.message });
    }
});

// 特定のお問い合わせ取得
router.get('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await global.db.query('SELECT * FROM Contact WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'お問い合わせが見つかりません' });
        }

        const contact = results[0];
        res.json({
            id: contact.id,
            userName: contact.uName,
            email: contact.email,
            subject: contact.title,
            message: contact.message,
            status: contact.status || 'new',
            createdAt: contact.time,
            category: contact.select_p
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

// 返信一覧取得
router.get('/contactReplies/:contactId', async (req, res) => {
    try {
        const { contactId } = req.params;

        const [results] = await global.db.query(
            'SELECT * FROM ContactReply WHERE contact_id = ? ORDER BY reply_time ASC',
            [contactId]
        );

        const formattedResults = results.map(reply => ({
            id: reply.id,
            contactId: reply.contact_id,
            message: reply.reply_message,
            createdAt: reply.reply_time
        }));
        res.json(formattedResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

// 返信を追加
router.post('/contactReplies', async (req, res) => {
    try {
        const { contactId, message } = req.body;

        if (!contactId || !message) {
            return res.status(400).json({ error: '必須項目が不足しています' });
        }

        // 返信を保存
        const [result] = await global.db.query(
            'INSERT INTO ContactReply (contact_id, reply_message) VALUES (?, ?)',
            [contactId, message]
        );

        // Contact の status を 'replied' に更新
        await global.db.query(
            'UPDATE Contact SET status = ? WHERE id = ?',
            ['replied', contactId]
        );

        res.json({
            id: result.insertId,
            contactId,
            message,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

// ステータス更新
router.patch('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['new', 'replied'].includes(status)) {
            return res.status(400).json({ error: '無効なステータスです' });
        }

        await global.db.query(
            'UPDATE Contact SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: 'ステータスが更新されました' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

// 返信を削除
router.delete('/contactReplies/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: '返信IDが必要です' });
        }

        const [result] = await global.db.query(
            'DELETE FROM ContactReply WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '返信が見つかりません' });
        }

        res.json({ message: '返信が削除されました' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

module.exports = router;