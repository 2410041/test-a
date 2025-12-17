const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// multer は環境によって存在しないとサーバ起動時に例外になるため安全にロードする
let uploadAvailable = true;
let cpUpload = null;
try {
    const multer = require('multer');

    // uploads ディレクトリ
    const uploadDir = path.resolve(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
    });
    const upload = multer({ storage });

    cpUpload = upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'photo_1', maxCount: 1 },
        { name: 'photo_2', maxCount: 1 },
        { name: 'photo_3', maxCount: 1 }
    ]);
} catch (error) {
    uploadAvailable = false;
    console.error('Warning: multer is not available or failed to load in newOfferServer.js. Upload routes will be disabled.', error && error.message ? error.message : error);
}

console.log('newOfferServer uploadAvailable =', uploadAvailable);

// --- ヘルパー関数 ---
// req.body の値が配列で来る場合があるため、まず単一値を取り出す
const normalizeValue = (value) => {
    if (value === undefined || value === null) return value;
    if (Array.isArray(value)) return value.length ? value[0] : undefined;
    return value;
};

// チェックボックス系を 1/0 に変換 (許容値: 'on', 'true', '1', 1, true)
const checkboxToInt = (value) => {
    const val = normalizeValue(value);
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'boolean') return val ? 1 : 0;
    const lowerString = String(val).toLowerCase();
    if (lowerString === 'on' || lowerString === 'true' || lowerString === '1') return 1;

    // 必ず number を返す
    const numericValue = Number(lowerString);
    return numericValue === 1 ? 1 : 0;
};


// 数値系フィールド（給与など）を安全に int に変換。変換できなければ null を返す
const toIntOrNull = (value) => {
    const val = normalizeValue(value);
    if (val === undefined || val === null || val === '') return null;
    const parsedInt = parseInt(String(val).replace(/[,\s]/g, ''), 10);
    return Number.isNaN(parsedInt) ? null : parsedInt;
};

// 文字列系は normalizeValue を通す（null または string）
const toStringOrNull = (value) => {
    const val = normalizeValue(value);
    if (val === undefined || val === null || val === '') return null;
    return String(val);
};

// handler を関数化して '/create' と '/' の両方で使えるようにする
const insertHandler = async (req, res) => {
    try {
        if (!uploadAvailable) {
            return res.status(503).json({ error: 'Upload functionality is currently unavailable on the server' });
        }

        const files = req.files || {};
        const getFileName = (field) => (files[field] && files[field][0] ? files[field][0].filename : null);

        // ここでチェックボックスや数値を確実に変換する
        const data = {
            company_name: toStringOrNull(req.body.company_name),
            logo: getFileName('logo'),
            photo_1: getFileName('photo_1'),
            photo_2: getFileName('photo_2'),
            photo_3: getFileName('photo_3'),
            postal_code: toStringOrNull(req.body.postal_code),
            address_input: toStringOrNull(req.body.address_input),
            address_kana: toStringOrNull(req.body.address_kana),
            establishment_year: toStringOrNull(req.body.establishment_year),
            establishment_month: toStringOrNull(req.body.establishment_month),
            establishment_day: toStringOrNull(req.body.establishment_day),
            capital_input: toStringOrNull(req.body.capital_input),
            employees_input: toStringOrNull(req.body.employees_input),
            business_content: toStringOrNull(req.body.business_content),
            homepage_url: toStringOrNull(req.body.homepage_url),
            job_title: toStringOrNull(req.body.job_title),
            job_description: toStringOrNull(req.body.job_description),
            employment_type: toStringOrNull(req.body.employment_type),
            recruitment_count: toStringOrNull(req.body.recruitment_count),
            required_skills: toStringOrNull(req.body.required_skills),
            preferred_skills: toStringOrNull(req.body.preferred_skills),
            education_age_restrictions: toStringOrNull(req.body.education_age_restrictions),
            work_location: toStringOrNull(req.body.work_location),
            work_start_hour: toStringOrNull(req.body.work_start_hour),
            work_start_minute: toStringOrNull(req.body.work_start_minute),
            work_end_hour: toStringOrNull(req.body.work_end_hour),
            work_end_minute: toStringOrNull(req.body.work_end_minute),
            work_break: toStringOrNull(req.body.work_break),
            shift_system: toStringOrNull(req.body.shift_system),

            // チェックボックス類は checkboxToInt で確実に 1/0 にする
            overtime_exists: Number(checkboxToInt(req.body.overtime_exists)),
            overtime_average: toStringOrNull(req.body.overtime_average),
            weekly_holiday: toStringOrNull(req.body.weekly_holiday),
            paid_leave: toStringOrNull(req.body.paid_leave),
            long_leave: Number(checkboxToInt(req.body.long_leave)),

            salary_min: toIntOrNull(req.body.salary_min),
            salary_max: toIntOrNull(req.body.salary_max),

            salary_raise: toStringOrNull(req.body.salary_raise),
            bonus: toStringOrNull(req.body.bonus),
            transport_allowance: toStringOrNull(req.body.transport_allowance),
            allowances: toStringOrNull(req.body.allowances),

            probation: Number(checkboxToInt(req.body.probation)),
            social_insurance: Number(checkboxToInt(req.body.social_insurance)),
            social_insurance_detail: toStringOrNull(req.body.social_insurance_detail),
            welfare_systems: toStringOrNull(req.body.welfare_systems),

            training_exists: Number(checkboxToInt(req.body.training_exists)),
            training_detail: toStringOrNull(req.body.training_detail),
            application_method: toStringOrNull(req.body.application_method),
            selection_flow: toStringOrNull(req.body.selection_flow),
            interview_location: toStringOrNull(req.body.interview_location),
            examination: Number(checkboxToInt(req.body.examination))
        };

        // 検証ログ（デバッグ用） — 運用時はコメントアウト推奨
        console.log('Prepared insert data:', data);

        const columns = Object.keys(data);
        const placeholders = columns.map(() => '?').join(',');
        const values = columns.map((columnName) => data[columnName]);

        const sql = `INSERT INTO job_offers (${columns.join(',')}) VALUES (${placeholders})`;
        const [result] = await global.db.query(sql, values);
        return res.json({ message: '登録成功', id: result.insertId });
    } catch (err) {
        console.error('POST /api/corporations/create error', err);
        return res.status(500).json({ error: 'Database error', detail: err.message });
    }
};

// POST /create
router.post('/create', uploadAvailable ? cpUpload : (req, res, next) => next(), insertHandler);

// POST /
// フロントが /newOffer に POST する場合に対応
router.post('/', uploadAvailable ? cpUpload : (req, res, next) => next(), insertHandler);

module.exports = router;
