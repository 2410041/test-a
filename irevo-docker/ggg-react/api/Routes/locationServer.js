const express = require('express');
const router = express.Router();

const PREF_LIST = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県',
    '岐阜県','静岡県','愛知県','三重県',
    '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
    '鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県',
    '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];

function splitAddress(addr) {
    if (!addr) return {
        prefecture: '', city: '', rest: ''
    };
    const pref = PREF_LIST.find(p => addr.startsWith(p)) || '';
    const remain = addr.slice(pref.length).trim();
    const cityMatch = remain.match(/^.*?(市|区|町|村)/);
    const city = cityMatch ? cityMatch[0]: '';
    const rest = city ? remain.slice(city.length).trim() : remain;
    return { prefecture: pref, city, rest };
}

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await global.db.query(
            'SELECT id, location FROM Companies WHERE id = ?',
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({
            success: false,
            message: 'not found'
        });
        const s = splitAddress(rows[0].location);
        res.json({
            id: rows[0].id,
            prefecture: s.prefecture,
            city: s.city,
            address_rest: s.rest,
            full_address: rows[0].location
        });
    } catch (error) {
        console.error('住所詳細取得エラー: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

router.get('/location', async (req, res) => {
    try {
        const [rows] = await global.db.query(
            'SELECT id, location FROM Companies WHERE location IS NOT NULL AND location <> ""'
        );
        const data = rows.map(r => {
            const s = splitAddress(r.location);
            return {
                id: r.id,
                prefecture: s.prefecture,
                city: s.city,
                address_rest: s.rest,
                full_address: r.location
            };
        });
        res.json(data);
    } catch (error) {
        console.error('Error get in /location: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

// 作成 (= 既存の会社に住所を設定) : { company_id, full_address }
router.post('/location', async (req, res) => {
    try {
        const { company_id, full_address } = req.body || {};
        if (!company_id || !full_address) {
            return res.status(400).json({
                success: false,
                message: 'company_id / full_address 必須'
            });
        }
        const [result] = await global.db.query(
            'SELECT id FROM Companies WHERE id = ?',
            [company_id]
        );
        if (!result.length) return res.status(404).json({
            success: false,
            message: 'company not found'
        });
        await global.db.query(
            'UPDATE Companies SET location = ? WHERE id = ?',
            [full_address, company_id]
        );
        res.json({
            success: true,
            id: Number(company_id), 
            full_address
        });
    } catch (error) {
        console.error('Error post in /location: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

router.put('/location/:id', async (req, res) => {
    try {
        const { full_address } = req.body || {};
        if (full_address === undefined) return res.status(400).json({
            success: false,
            message: 'full_address 必須'
        });
        await global.db.query(
            'UPDATE Companies SET location = ? WHERE id = ?',
            [full_address, req.params.id]
        );
        res.json({
            success: true,
            id: Number(req.params.id),
            full_address
        });
    } catch (error) {
        console.error('Error put in /location/:id: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

router.delete('/location/:id', async (req, res) => {
    try {
        await global.db.query(
            'UPDATE Companies SET location = NULL WHERE id = ?',
            [req.params.id]
        );
        res.json({
            success: false,
            id: Number(req.params.id)
        });
    } catch (error) {
        console.error('Error delete in /location/:id: ', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
});

module.exports = router;