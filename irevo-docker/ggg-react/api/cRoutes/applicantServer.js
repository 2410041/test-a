const express = require('express');
const router = express.Router();

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

// POST /applicant
// Create new application record. Body: { user_id, job_id, resume_link (optional), status (optional) }
router.post('/', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const { user_id, job_id, resume_link, status } = params;

        // user_id 確認
        if (!user_id) return res.status(400).json({
            success: false,
            message: 'user_id is required'
        });

        // 応募データを登録
        const [rows] = await global.db.query(
            `INSERT INTO Applications (user_id, job_id, resume_link, status) VALUES (?, ?, ?, ?)`,
            [user_id, job_id, resume_link || null, status || '新規']
        );

        res.json({
            success: true,
            id: rows.insertId
        });
    } catch (error) {
        // エラー出力
        console.error('POST /applicants/create error', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// GET /applicant
// Returns list of applications joined with user info
router.get('/', async (req, res) => {
    try {
        // セッションから corporation_id を取得
        const corporationId = req.session?.company?.id;

        // ログインチェック
        if (!corporationId) {
            return res.status(401).json({
                success: false,
                message: 'not logged in'
            });
        }

        // 応募情報とユーザー情報を同時に取得する SQL
        const [rows] = await global.db.query(
            `SELECT a.id AS application_id, a.user_id, a.job_id, a.applied_at, a.status, a.resume_link,
                u.u_Fname, u.u_Lname, u.u_kana, u.u_nick, u.Birthday, u.Gender, u.u_Contact, u.u_Address,
                u.u_Email, u.Employment, jo.job_title FROM Applications a JOIN job_offers jo ON a.job_id = jo.id
            JOIN corporations c ON jo.company_id = c.id JOIN User u ON u.id = a.user_id WHERE c.id = ?
            ORDER BY a.applied_at DESC`,
            [corporationId]
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('GET /applicants/get error', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// PATCH /applicant/:id
// Update status (or other fields) of an application
// 応募ステータス更新用ルーティング
// 単一の応募データに対してステータスを更新する
router.patch('/:id', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const { status } = params;
        const id = req.params.id;

        // statusを確認
        if (!status) return res.status(400).json({
            success: false,
            message: 'status is required'
        });

        const [rows] = await global.db.query(
            'UPDATE Applications SET status = ? WHERE id = ?',
            [status, id]
        );

        // 更新情報がない場合の処理
        if (rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'ステータスが更新されました'
        });
    } catch (error) {
        // エラー処理
        console.error('PATCH /applicants/update/:id error', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// PATCH /applicant  (bulk update)
// Body: { ids: [1,2,3], status: '書類選考中' }
// 応募ステータス一括更新用ルーティング
// 複数の応募 ID をまとめて同じステータスに更新する
router.patch('/', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const { ids, status } = params;

        // ID 配列チェック
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'ids 配列が必要です'
            });
        }

        // status チェック
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'status が必要です'
            });
        }

        // IN 句用のプレースホルダー生成
        const placeholders = ids.map(() => '?').join(',');

        // 一括更新クエリ実行
        const [rows] = await global.db.query(
            `UPDATE Applications SET status = ? WHERE id IN (${placeholders})`,
            [status, ...ids]
        );

        res.json({
            success: true,
            affectedRows: rows.affectedRows,
            message: 'ステータスが一括更新されました'
        });
    } catch (error) {
        // エラー処理
        console.error('PATCH /applicants error', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;