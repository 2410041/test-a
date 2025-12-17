const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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

// multer設定（省略）
// 画像アップロード
let uploadAvailable = true;
let cpUpload = null;

try {
    // multer : 画像保存のライブラリ
    const multer = require('multer');

    // 保存先フォルダの設定
    const uploadDir = path.resolve(__dirname, '../../public/uploads');

    // ファルダがなければ作成する
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true
        });
    }

    // 画像の保存設定
    const storage = multer.diskStorage({
        // 保存先フォルダ
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        // ファイル名の設定
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });

    // multer の設定
    const upload = multer({ storage });

    // 受け取れる画像の名前の設定
    cpUpload = upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'photo_1', maxCount: 1 },
        { name: 'photo_2', maxCount: 1 },
        { name: 'photo_3', maxCount: 1 }
    ]);

} catch (error) {
    // multer が使えないときの処理
    uploadAvailable = false;
    console.warn('multer not available for jobOfferServer: ', error);
}

// 求人情報に登録されているスキル取得
// GET /api/job_Offers/:jobOfferId/skills
router.get('/:jobOfferId/skills', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const jobOfferId = Number(params.jobOfferId);

        // スキル情報取得
        const [rows] = await global.db.query(
            `SELECT sm.skillName FROM companySkill cs JOIN skillMaster sm ON cs.skillId = sm.id WHERE cs.jobOfferId = ?`,
            [jobOfferId]
        );

        res.json({
            success: true,
            skills: rows,
            message: 'スキル情報を取得しました'
        });
    } catch (error) {
        // エラー内容出力
        console.error('Error in GET /api/job-Offers/:jobOfferId/skills: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 会社名から求人情報取得
// GET /api/job_Offers?companyName=
router.get('/', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const companyId = params.company_id;

        // 項目チェック 例）: companyName がない場合エラー表示
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: 'company_id is required'
            });
        }

        // 求人一覧取得
        const [rows] = await global.db.query(
            `SELECT * FROM job_offers WHERE company_id = ? ORDER BY id DESC`,
            [companyId]
        );

        res.json(rows || []);
    } catch (error) {
        console.error('Error in GET /api/job_Offers: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 求人情報１件取得
// GET /api/job_Offers/:jobOfferId
router.get('/:jobOfferId', async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const jobOfferId = Number(params.jobOfferId);

        // jobOfferId チェック
        if (!jobOfferId) {
            return res.status(400).json({
                success: false,
                message: 'jobOfferId is required'
            });
        }

        // 求人情報取得
        const [rows] = await global.db.query(
            `SELECT * FROM job_offers WHERE id = ?`,
            [jobOfferId]
        );

        // 求人情報がない場合
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job offer data not found'
            });
        }

        res.json({
            success: true,
            items: rows[0],
            message: '求人情報を取得しました'
        });
    } catch (error) {
        // エラー出力
        console.error('Error in GET /api/job_Offers/:jobOfferId: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 求人情報を更新
// PATCH /api/job_Offers/:jobOfferId
router.patch('/:jobOfferId', uploadAvailable ? cpUpload : (req, res, next) => next(), async (req, res) => {
    try {
        const params = getParams(req);
        // パラメータ取得
        const jobOfferId = Number(params.jobOfferId);
        const files = req.files || {};

        // jobOfferId チェック
        if (!jobOfferId) {
            return res.status(400).json({
                success: false,
                message: 'jobOfferId is required'
            });
        }

        // 更新許可カラムのリスト
        const allowed = [
            'company_name', 'job_title', 'job_description', 'employment_type', 'recruitment_count',
            'required_skills', 'preferred_skills', 'work_location', 'work_start_hour', 'work_start_minute',
            'work_end_hour', 'work_end_minute', 'work_break', 'shift_system', 'overtime_exists', 'overtime_average',
            'weekly_holiday', 'paid_leave', 'long_leave', 'salary_min', 'salary_max', 'salary_raise', 'bonus',
            'transport_allowance', 'allowances', 'probation', 'social_insurance', 'social_insurance_detail',
            'welfare_systems', 'training_exists', 'training_detail', 'application_method', 'selection_flow',
            'interview_location', 'approved'
        ];

        const updateSql = [];
        const values = [];

        // テキスト項目の更新処理
        allowed.forEach((col) => {
            if (params[col] !== undefined) {
                updateSql.push(`${col} = ?`);
                values.push(params[col]);
            }
        });

        // 画像項目の更新処理
        const getFileName = (name) =>
            files[name] ? files[name][0].filename : null;

        ['logo', 'photo_1', 'photo_2', 'photo_3'].forEach((img) => {
            const filename = getFileName(img);
            if (filename) {
                updateSql.push(`${img} = ?`);
                values.push(filename);
            }
        });

        // 更新するデータがない場合
        if (updateSql.length === 0) {
            return res.status(400).json({
                success: false,
                message: '更新するデータがありません'
            });
        }

        values.push(jobOfferId);

        // 更新実行処理
        const [result] = await global.db.query(
            `UPDATE job_offers SET ${updateSql.join(', ')} WHERE id = ?`,
            [...values]
        );

        res.json({
            success: true,
            message: '求人情報を更新しました',
            changedRows: result.affectedRows
        });
    } catch (error) {
        // エラー出力
        console.error('Error in PATCH /api/job_Offers/:jobOfferId: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;